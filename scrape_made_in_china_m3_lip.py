import argparse
import concurrent.futures
import hashlib
import os
import re
import sys
import time
from dataclasses import dataclass, asdict
from typing import List, Optional, Dict, Any

import boto3
import botocore
import requests
from bs4 import BeautifulSoup


DEFAULT_URL = (
    "https://www.made-in-china.com/productdirectory.do?subaction=hunt&style=b&mode=and&code=0&comProvince=nolimit&order=0&isOpenCorrection=1&org=top&keyword=&file=&searchType=0&word=M3+lip&log_from=4&bv_id=1j9c5mv1s4e9"
)


@dataclass
class Product:
    product_id: str
    title: str
    product_url: str
    image_url: Optional[str]
    image_local_path: Optional[str]
    price_text: Optional[str]
    moq_text: Optional[str]
    supplier_name: Optional[str]
    supplier_url: Optional[str]
    source: str


def stable_id_from_url(url: str) -> str:
    return hashlib.sha256(url.encode("utf-8")).hexdigest()[:24]


def build_headers() -> Dict[str, str]:
    return {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/120.0 Safari/537.36"
        ),
        "Accept-Language": "en-US,en;q=0.9",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Connection": "keep-alive",
    }


def sanitize_filename(name: str) -> str:
    cleaned = re.sub(r"[^a-zA-Z0-9._-]+", "_", name).strip("._-")
    return cleaned or "image"


def ensure_dir(path: str) -> None:
    os.makedirs(path, exist_ok=True)


def get_with_retries(url: str, timeout: int = 20) -> requests.Response:
    last_exc: Optional[Exception] = None
    for attempt in range(5):
        try:
            response = requests.get(url, headers=build_headers(), timeout=timeout)
            response.raise_for_status()
            return response
        except Exception as exc:  # noqa: BLE001 - surface and retry
            last_exc = exc
            time.sleep(1 + attempt * 0.8)
    raise RuntimeError(f"Failed to GET {url}: {last_exc}")


def parse_products_from_page(html: str) -> List[Product]:
    soup = BeautifulSoup(html, "html.parser")

    # The site can change; try a few robust selectors
    product_cards = []
    candidates = [
        ("div", {"class": re.compile(r"product-item|list-item|list-product|pro-item", re.I)}),
        ("li", {"class": re.compile(r"product|pro-item|list", re.I)}),
        ("div", {"data-s-virtual": True}),
    ]
    for tag, attrs in candidates:
        found = soup.find_all(tag, attrs=attrs)
        if found:
            product_cards = found
            break

    products: List[Product] = []
    for card in product_cards:
        # Title/link
        title_el = card.find("a", href=True)
        title_text = None
        product_url = None
        if title_el:
            title_text = title_el.get("title") or title_el.get_text(strip=True)
            product_url = title_el.get("href")
            if product_url and product_url.startswith("/"):
                product_url = f"https://www.made-in-china.com{product_url}"

        # Image
        img_el = card.find("img")
        image_url = None
        if img_el:
            image_url = (
                img_el.get("data-src")
                or img_el.get("data-original")
                or img_el.get("src")
            )
            if image_url and image_url.startswith("//"):
                image_url = f"https:{image_url}"

        # Price and MOQ texts (best-effort)
        price_text = None
        moq_text = None
        price_candidates = card.find_all(text=re.compile(r"\b(US\$|\$|price)\b", re.I))
        if price_candidates:
            price_text = price_candidates[0].strip()
        moq_candidates = card.find_all(text=re.compile(r"\bMOQ\b|\bMin\.|Minimum\s+Order", re.I))
        if moq_candidates:
            moq_text = moq_candidates[0].strip()

        # Supplier
        supplier_name = None
        supplier_url = None
        supplier_link = card.find("a", href=True, attrs={"href": re.compile(r"company|supplier", re.I)})
        if supplier_link:
            supplier_name = supplier_link.get("title") or supplier_link.get_text(strip=True)
            supplier_url = supplier_link.get("href")
            if supplier_url and supplier_url.startswith("/"):
                supplier_url = f"https://www.made-in-china.com{supplier_url}"

        if not product_url or not title_text:
            continue

        product_id = stable_id_from_url(product_url)
        products.append(
            Product(
                product_id=product_id,
                title=title_text,
                product_url=product_url,
                image_url=image_url,
                image_local_path=None,
                price_text=price_text,
                moq_text=moq_text,
                supplier_name=supplier_name,
                supplier_url=supplier_url,
                source="made-in-china",
            )
        )
    return products


def maybe_download_image(image_url: Optional[str], download_dir: str, title: str) -> Optional[str]:
    if not image_url:
        return None
    ensure_dir(download_dir)
    name = sanitize_filename(title)[:64]
    ext = os.path.splitext(image_url.split("?")[0])[1] or ".jpg"
    filename = f"{name}{ext}"
    dest_path = os.path.join(download_dir, filename)
    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 0:
        return dest_path
    try:
        resp = get_with_retries(image_url, timeout=30)
        with open(dest_path, "wb") as f:
            f.write(resp.content)
        return dest_path
    except Exception:
        return None


def discover_paged_urls(base_url: str, pages: int) -> List[str]:
    if pages <= 1:
        return [base_url]
    urls = [base_url]
    # Try common pagination parameter: page=2,3,...
    sep = "&" if "?" in base_url else "?"
    for p in range(2, pages + 1):
        urls.append(f"{base_url}{sep}page={p}")
    return urls


def scrape_products(base_url: str, pages: int, delay_sec: float) -> List[Product]:
    urls = discover_paged_urls(base_url, pages)
    products: List[Product] = []
    for idx, url in enumerate(urls):
        resp = get_with_retries(url)
        page_products = parse_products_from_page(resp.text)
        products.extend(page_products)
        if idx < len(urls) - 1 and delay_sec > 0:
            time.sleep(delay_sec)
    # De-duplicate by product_url
    unique: Dict[str, Product] = {}
    for p in products:
        unique[p.product_url] = p
    return list(unique.values())


def attach_images(products: List[Product], download_dir: str, max_workers: int = 8) -> None:
    def _job(p: Product) -> None:
        p.image_local_path = maybe_download_image(p.image_url, download_dir, p.title)

    ensure_dir(download_dir)
    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as ex:
        list(ex.map(_job, products))


def upsert_products_to_dynamo(
    products: List[Product],
    table_name: str,
    region_name: Optional[str],
    extra_attrs: Optional[Dict[str, Any]] = None,
) -> None:
    session = boto3.session.Session(region_name=region_name)
    dynamodb = session.resource("dynamodb")
    table = dynamodb.Table(table_name)

    # Validate table exists
    try:
        table.load()
    except botocore.exceptions.ClientError as e:  # noqa: BLE001
        raise RuntimeError(f"DynamoDB table not accessible: {e}")

    with table.batch_writer(overwrite_by_pkeys=["pk"]) as batch:
        for p in products:
            # Map to FE-expected structure while keeping admin metadata
            # id/name/price/image/images/description/specifications/features
            # Price best-effort: parse number from price_text (USD or generic). If not found, set 0.
            price_value = 0
            if p.price_text:
                digits = re.findall(r"\d+[\d,.]*", p.price_text)
                if digits:
                    num = digits[0].replace(".", "").replace(",", "")
                    try:
                        price_value = int(num)
                    except Exception:
                        price_value = 0

            item = {
                # Keys
                "pk": f"prod#{p.product_id}",
                "sk": "prod",
                # FE fields
                "id": p.product_id,
                "name": p.title,
                "price": price_value,
                "image": p.image_url or "",
                "images": [p.image_url] if p.image_url else [],
                "description": "",
                "specifications": [],
                "features": [],
                # Optional category hint from query context
                "category": "BMW M3/M4 | Exteriér",
                # Admin/source metadata
                "productUrl": p.product_url,
                "imageLocalPath": p.image_local_path or "",
                "priceText": p.price_text or "",
                "moqText": p.moq_text or "",
                "supplierName": p.supplier_name or "",
                "supplierUrl": p.supplier_url or "",
                "source": p.source,
                "updatedAt": int(time.time()),
            }
            if extra_attrs:
                item.update(extra_attrs)
            batch.put_item(Item=item)


def parse_args(argv: Optional[List[str]] = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Scrape Made-in-China search results and upsert into DynamoDB",
    )
    parser.add_argument(
        "--url",
        default=DEFAULT_URL,
        help="Search URL to scrape (default: preset M3 lip URL)",
    )
    parser.add_argument(
        "--pages",
        type=int,
        default=1,
        help="Number of pages to attempt via page= pagination (default: 1)",
    )
    parser.add_argument(
        "--delay-sec",
        type=float,
        default=1.0,
        help="Delay between page requests in seconds (default: 1.0)",
    )
    parser.add_argument(
        "--download-dir",
        default=os.path.join("data", "made-in-china", "m3-lip", "images"),
        help="Directory to store downloaded images",
    )
    parser.add_argument(
        "--table-name",
        required=True,
        help="DynamoDB table name",
    )
    parser.add_argument(
        "--aws-region",
        default=None,
        help="AWS region (if not set, boto3 defaults/environment will be used)",
    )
    parser.add_argument(
        "--extra-attr",
        action="append",
        default=[],
        metavar="KEY=VALUE",
        help="Additional attributes to include in each item (repeatable)",
    )
    return parser.parse_args(argv)


def parse_extra_attrs(kv_pairs: List[str]) -> Dict[str, str]:
    out: Dict[str, str] = {}
    for pair in kv_pairs:
        if "=" in pair:
            k, v = pair.split("=", 1)
            out[k] = v
    return out


def main(argv: Optional[List[str]] = None) -> int:
    args = parse_args(argv)
    extra_attrs = parse_extra_attrs(args.extra_attr)

    print(f"Scraping: {args.url} (pages={args.pages})")
    products = scrape_products(args.url, args.pages, args.delay_sec)
    print(f"Found {len(products)} unique products")

    print(f"Downloading images into: {args.download_dir}")
    attach_images(products, args.download_dir)

    print(f"Upserting {len(products)} products into DynamoDB table: {args.table_name}")
    upsert_products_to_dynamo(
        products=products,
        table_name=args.table_name,
        region_name=args.aws_region,
        extra_attrs=extra_attrs,
    )
    print("Done.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())


