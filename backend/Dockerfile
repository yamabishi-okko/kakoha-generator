# ☁️⑧ PHP 8.3（Alpine Linux）を土台にする
FROM php:8.3-cli-alpine

# ☁️⑨ unzip と curl をインストールする（Composer が内部で使用する）
RUN apk add --no-cache unzip curl

# Composer（PHP のパッケージマネージャー）を公式イメージからコピーして持ってくる
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# ☁️⑩ composer.json を先にコピーして依存パッケージをインストールする
# ソースより先に分けておくと、ソース変更時に composer install のキャッシュが効く（☁️⑥と同じ考え方）
COPY composer*.json ./
RUN composer install --optimize-autoloader --no-scripts

# ☁️⑪ ソースをコピーし、.env を .env.example から生成してアプリキーを発行する
COPY . .
RUN cp .env.example .env && php artisan key:generate

EXPOSE 8000

# ☁️⑫ コンテナ起動時に php artisan serve を実行する
# --host=0.0.0.0：コンテナ外（ホストMac）からアクセスできるようにする
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
