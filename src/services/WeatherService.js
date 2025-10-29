// WeatherService.js - Hava durumu API entegrasyonu
// İklim risk projesinden adapt edilmiştir

// OpenWeatherMap API konfigürasyonu
const WEATHER_API_KEY = '9ae6b5b6421f71c259ab6099f62a16c8'; // Ücretsiz plan API key
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

export class WeatherService {
    constructor() {
        this.apiKey = WEATHER_API_KEY;
        this.cache = new Map();
        this.cacheTimeout = 30 * 60 * 1000; // 30 dakika cache
    }

    // Lokasyon için hava durumu verisi getir
    async getWeatherForLocation(lat, lon) {
        const cacheKey = `${lat.toFixed(2)}_${lon.toFixed(2)}`;
        
        // Cache kontrolü
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        try {
            const response = await fetch(
                `${WEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=tr`
            );
            
            if (!response.ok) {
                throw new Error(`API yanıtı başarısız: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Cache'e kaydet
            this.cache.set(cacheKey, {
                data,
                timestamp: Date.now()
            });
            
            return data;
        } catch (error) {
            console.error('Hava durumu API hatası:', error);
            throw error;
        }
    }

    // Multiple locations için batch işlem
    async getWeatherForMultipleLocations(locations) {
        const promises = locations.map(async location => {
            try {
                const weather = await this.getWeatherForLocation(location.lat, location.lon);
                return {
                    location,
                    weather,
                    success: true
                };
            } catch (error) {
                console.error(`${location.name} için hava durumu alınamadı:`, error);
                return {
                    location,
                    weather: null,
                    success: false,
                    error: error.message
                };
            }
        });

        return Promise.all(promises);
    }

    // Asset için risk skorunu hava durumuyla güncelle
    updateAssetRiskWithWeather(asset, weather) {
        if (!weather) return asset;

        const temp = weather.main.temp;
        const humidity = weather.main.humidity;
        const rain = weather.rain ? weather.rain['1h'] || 0 : 0;
        const windSpeed = weather.wind.speed;

        // Mevcut fiziksel risk verilerini kopyala
        const updatedAsset = { ...asset };
        
        if (!updatedAsset.physicalData) {
            updatedAsset.physicalData = {
                hazards: { flood: 3.0, heatwave: 3.0, drought: 3.0, storm: 3.0 },
                sensitivity: 3.0,
                adaptiveCapacity: 3.0
            };
        }

        // Hazard skorlarını hava durumuna göre güncelle
        const hazards = { ...updatedAsset.physicalData.hazards };

        // Sel riski hesaplama (yağış miktarına göre)
        if (rain > 10) {
            hazards.flood = Math.min(5, 3 + (rain / 10));
        } else if (rain > 5) {
            hazards.flood = 2.5 + (rain / 20);
        } else {
            hazards.flood = Math.max(1, (hazards.flood || 3) - 0.5);
        }

        // Sıcak dalgası riski (sıcaklığa göre)
        if (temp > 35) {
            hazards.heatwave = Math.min(5, 3 + ((temp - 35) / 5));
        } else if (temp > 30) {
            hazards.heatwave = 2 + ((temp - 30) / 10);
        } else {
            hazards.heatwave = Math.max(1, 2 - ((30 - temp) / 20));
        }

        // Kuraklık riski (nem oranına göre)
        if (humidity < 30) {
            hazards.drought = Math.min(5, 4 - (humidity / 10));
        } else if (humidity < 50) {
            hazards.drought = 2.5;
        } else {
            hazards.drought = Math.max(1, 2 - ((humidity - 50) / 50));
        }

        // Fırtına riski (rüzgar hızına göre)
        if (windSpeed > 20) {
            hazards.storm = Math.min(5, 3 + (windSpeed / 10));
        } else if (windSpeed > 10) {
            hazards.storm = 2 + (windSpeed / 20);
        } else {
            hazards.storm = Math.max(1, 2 - ((10 - windSpeed) / 10));
        }

        // Güncellenmiş hazard verilerini ata
        updatedAsset.physicalData.hazards = hazards;

        // Hava durumu bilgisini sakla
        updatedAsset.lastWeatherUpdate = {
            date: new Date().toISOString(),
            temp,
            humidity,
            rain,
            windSpeed,
            weatherMain: weather.weather[0].main,
            weatherDesc: weather.weather[0].description
        };

        return updatedAsset;
    }

    // Batch asset güncelleme
    async updateAssetsWithWeather(assets, onProgress = null) {
        const locations = assets.map(asset => ({
            id: asset.id,
            name: asset.name,
            lat: asset.lat,
            lon: asset.lon
        }));

        const weatherResults = await this.getWeatherForMultipleLocations(locations);
        const updatedAssets = [];

        weatherResults.forEach((result, index) => {
            const asset = assets[index];
            
            if (result.success) {
                const updatedAsset = this.updateAssetRiskWithWeather(asset, result.weather);
                updatedAssets.push(updatedAsset);
            } else {
                // Hava durumu alınamazsa orijinal asset'i ekle
                updatedAssets.push(asset);
            }

            // Progress callback
            if (onProgress) {
                onProgress({
                    completed: index + 1,
                    total: assets.length,
                    currentAsset: asset.name,
                    success: result.success
                });
            }
        });

        return {
            updatedAssets,
            summary: {
                total: assets.length,
                successful: weatherResults.filter(r => r.success).length,
                failed: weatherResults.filter(r => !r.success).length
            }
        };
    }

    // Hava durumu uyarıları oluştur
    generateWeatherAlerts(weatherData, assetName) {
        const alerts = [];

        if (weatherData.main.temp > 35) {
            alerts.push({
                type: 'warning',
                severity: 'high',
                title: 'Aşırı Sıcaklık',
                message: `${assetName} lokasyonunda ${weatherData.main.temp}°C sıcaklık tespit edildi.`,
                recommendation: 'Soğutma sistemlerini kontrol edin ve çalışanları koruyun.'
            });
        }

        if (weatherData.rain && weatherData.rain['1h'] > 10) {
            alerts.push({
                type: 'danger',
                severity: 'high',
                title: 'Şiddetli Yağış',
                message: `${assetName} lokasyonunda saatte ${weatherData.rain['1h']}mm yağış bekleniyor.`,
                recommendation: 'Taşkın önlemlerini gözden geçirin ve drenaj sistemini kontrol edin.'
            });
        }

        if (weatherData.wind.speed > 15) {
            alerts.push({
                type: 'warning',
                severity: 'medium',
                title: 'Güçlü Rüzgar',
                message: `${assetName} lokasyonunda ${weatherData.wind.speed} m/s rüzgar hızı.`,
                recommendation: 'Yapısal güvenliği kontrol edin ve açık alanları boşaltın.'
            });
        }

        if (weatherData.main.humidity < 30) {
            alerts.push({
                type: 'info',
                severity: 'low',
                title: 'Düşük Nem',
                message: `${assetName} lokasyonunda nem oranı %${weatherData.main.humidity}.`,
                recommendation: 'Yangın riskine karşı dikkatli olun ve nem seviyesini izleyin.'
            });
        }

        return alerts;
    }

    // API durumunu kontrol et
    async checkApiHealth() {
        try {
            // İstanbul koordinatları ile test
            const testResponse = await this.getWeatherForLocation(41.0082, 28.9784);
            return {
                status: 'healthy',
                message: 'API bağlantısı başarılı',
                lastCheck: new Date().toISOString()
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                message: error.message,
                lastCheck: new Date().toISOString()
            };
        }
    }

    // Cache temizleme
    clearCache() {
        this.cache.clear();
    }

    // Cache istatistikleri
    getCacheStats() {
        return {
            size: this.cache.size,
            entries: Array.from(this.cache.keys())
        };
    }
}

// Singleton instance
export const weatherService = new WeatherService();

// React hook için wrapper
export const useWeatherService = () => {
    return weatherService;
};

// Utility fonksiyonları
export const WeatherUtils = {
    // Hava durumu simgesi getir
    getWeatherIcon(weatherCode) {
        const iconMap = {
            '01d': '☀️', '01n': '🌙',
            '02d': '⛅', '02n': '☁️',
            '03d': '☁️', '03n': '☁️',
            '04d': '☁️', '04n': '☁️',
            '09d': '🌧️', '09n': '🌧️',
            '10d': '🌦️', '10n': '🌧️',
            '11d': '⛈️', '11n': '⛈️',
            '13d': '🌨️', '13n': '🌨️',
            '50d': '🌫️', '50n': '🌫️'
        };
        return iconMap[weatherCode] || '🌡️';
    },

    // Rüzgar yönünü derece cinsinden metne çevir
    getWindDirection(degrees) {
        const directions = ['K', 'KKD', 'KD', 'DKD', 'D', 'DGD', 'GD', 'GGD', 
                          'G', 'GGB', 'GB', 'BGB', 'B', 'BBK', 'BK', 'KBK'];
        return directions[Math.round(degrees / 22.5) % 16];
    },

    // Hissedilen sıcaklık hesaplama
    calculateFeelsLike(temp, humidity, windSpeed) {
        // Basit heat index hesaplama
        if (temp >= 27) {
            const hi = -42.379 + 2.04901523 * temp + 10.14333127 * humidity
                     - 0.22475541 * temp * humidity;
            return Math.round(hi * 10) / 10;
        }
        return temp;
    },

    // UV indeksi renk kodu
    getUVColorCode(uvIndex) {
        if (uvIndex <= 2) return '#4CAF50';      // Yeşil - Düşük
        if (uvIndex <= 5) return '#FFEB3B';      // Sarı - Orta  
        if (uvIndex <= 7) return '#FF9800';      // Turuncu - Yüksek
        if (uvIndex <= 10) return '#F44336';     // Kırmızı - Çok Yüksek
        return '#9C27B0';                        // Mor - Ekstrem
    }
};

export default weatherService;