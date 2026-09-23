# DOST backend - CodeIgniter 4 + PHP 8.2 + Apache
# Used by Render (Docker runtime). Document root = /var/www/html/public
FROM php:8.2-apache

# System deps: libpq-dev builds the pgsql extensions; libicu-dev for intl; unzip for composer
RUN apt-get update \
    && apt-get install -y --no-install-recommends libpq-dev libicu-dev unzip \
    && rm -rf /var/lib/apt/lists/*

# PHP extensions: mysqli (legacy/local) + pgsql/pdo_pgsql (Supabase) + intl (CI4 requirement)
RUN docker-php-ext-install mysqli pdo_mysql pgsql pdo_pgsql intl

# Generous upload/processing limits (Excel + PDF imports)
RUN echo "upload_max_filesize=50M" > /usr/local/etc/php/conf.d/app.ini \
    && echo "post_max_size=60M" >> /usr/local/etc/php/conf.d/app.ini \
    && echo "memory_limit=512M" >> /usr/local/etc/php/conf.d/app.ini

# Apache: enable mod_rewrite for CodeIgniter routing
RUN a2enmod rewrite headers

# Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www/html

# Install dependencies (layer cached independently of source changes)
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress --prefer-dist

# Application source
COPY . .

# CodeIgniter serves from public/
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
    && sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf \
    && sed -ri -e 's!AllowOverride None!AllowOverride All!g' /etc/apache2/apache2.conf

# writable/ must be writable at runtime
RUN chown -R www-data:www-data /var/www/html/writable

EXPOSE 80