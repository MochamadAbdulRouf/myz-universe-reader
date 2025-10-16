#!/bin/sh

# Tentukan direktori root tempat Nginx menyajikan file
NGINX_ROOT=/usr/share/nginx/html

# Temukan file JavaScript utama yang dihasilkan oleh Vite.
# Nama file ini biasanya memiliki hash unik, jadi kita cari polanya.
MAIN_JS_FILE=$(find $NGINX_ROOT/assets -name "index-*.js")

# Periksa apakah file JavaScript ditemukan
if [ -z "$MAIN_JS_FILE" ]; then
  echo "Error: File JavaScript utama tidak ditemukan di $NGINX_ROOT/assets"
  exit 1
fi

echo "File JavaScript ditemukan: $MAIN_JS_FILE"
echo "Mengganti environment variables..."

# Ganti placeholder di dalam file JavaScript dengan nilai dari environment variable.
# Delimiter '|' digunakan agar tidak bentrok dengan karakter '/' pada URL.
sed -i "s|__VITE_SUPABASE_URL__|$VITE_SUPABASE_URL|g" "$MAIN_JS_FILE"
sed -i "s|__VITE_SUPABASE_PUBLISHABLE_KEY__|$VITE_SUPABASE_PUBLISHABLE_KEY|g" "$MAIN_JS_FILE"

echo "Penggantian selesai."
echo "Memulai Nginx..."

# Jalankan proses Nginx di foreground. Ini adalah cara standar
# untuk menjalankan proses utama di dalam container.
exec nginx -g 'daemon off;'