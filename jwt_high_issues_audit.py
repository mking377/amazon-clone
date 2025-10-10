#!/usr/bin/env python3
# jwt_secret_tester_full.py
# يولد توكنات ويجربها على /test-token باستخدام كل JWT_SECRET موجود في المشروع

import os
import re
import time
import jwt            # PyJWT
import requests

# --- قابل للتعديل ---
PROJECT_DIR = "./services/user"            # جذر ملفات الخدمة (غيّره لو لازم)
TEST_TOKEN_ROUTES = [
    "http://localhost:5000/test-token"     # اضافة أي راوت مماثل هنا
]
JWT_ALGORITHM = "HS256"
TOKEN_EXP_SECONDS = 60                     # صلاحية قصيرة للتجربة
# ----------------------

# نمط للعثور على تعريفات JWT_SECRET في ملفات بايثون
jwt_pattern = re.compile(
    r'JWT_SECRET\s*=\s*(?:os\.getenv\(\s*"JWT_SECRET"(?:\s*,\s*"([^"]*)")?\s*\)|"([^"]*)")'
)

secrets_found = set()

for root, dirs, files in os.walk(PROJECT_DIR):
    for file in files:
        if file.endswith(".py"):
            path = os.path.join(root, file)
            try:
                with open(path, "r", encoding="utf-8", errors="ignore") as f:
                    for line in f:
                        m = jwt_pattern.search(line)
                        if m:
                            secret = (m.group(1) or m.group(2) or "").strip()
                            if secret:
                                secrets_found.add(secret)
            except Exception as e:
                print(f"⚠️ Error reading {path}: {e}")

if not secrets_found:
    print("❗ لم يتم العثور على أي JWT_SECRET صريحة عبر البحث. تأكد .env أو مسارات أخرى.")
else:
    print("\n===== JWT_SECRETS Found =====")
    for s in secrets_found:
        print(repr(s))

print("\n===== Testing each secret by generating a real JWT =====\n")

results = []

for secret in secrets_found:
    payload = {
        "sub": "audit-test",
        "iat": int(time.time()),
        "exp": int(time.time()) + TOKEN_EXP_SECONDS
    }
    try:
        token = jwt.encode(payload, secret, algorithm=JWT_ALGORITHM)
        if isinstance(token, bytes):
            token = token.decode()
    except Exception as e:
        print(f"Secret={repr(secret)} -> failed to encode token: {e}")
        results.append((secret, "encode_failed", str(e)))
        continue

    for route in TEST_TOKEN_ROUTES:
        try:
            # تجربة 1: Authorization Bearer header
            headers = {"Authorization": f"Bearer {token}"}
            r1 = requests.get(route, headers=headers, timeout=5)
            ok1 = (r1.status_code == 200)

            # تجربة 2: Cookie (in case الخدمة تتوقع token في كوكي)
            cookies = {"token": token}
            r2 = requests.get(route, cookies=cookies, timeout=5)
            ok2 = (r2.status_code == 200)

            # سجل النتائج (نص الاستجابة لتشخيص أعمق)
            detail = {
                "route": route,
                "header_status": r1.status_code,
                "header_body": (r1.text[:1000] if r1.text else ""),
                "cookie_status": r2.status_code,
                "cookie_body": (r2.text[:1000] if r2.text else "")
            }

            status = "success" if (ok1 or ok2) else "failed"
            results.append((secret, route, status, detail))

            print(f"Secret={repr(secret)} | route={route} | status={status} | header={r1.status_code} cookie={r2.status_code}")
        except Exception as e:
            print(f"Secret={repr(secret)} | route={route} -> request error: {e}")
            results.append((secret, route, "request_error", str(e)))

# خلاصة قصيرة
print("\n===== Summary =====")
for r in results:
    if r[2] == "success":
        print(f"✅ {repr(r[0])} works on {r[1]}")
    else:
        print(f"❌ {repr(r[0])} -> {r[2]}")

print("\n(انتهى الاختبار)")
