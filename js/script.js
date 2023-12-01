
        var currentPage = 1;
        var resultsPerPage = 10;

        // Sayfada gösterilecek sonuç sayısı
        function loadResults() {
            var keyword = document.getElementById('search-box').value.trim();
            var platform = document.getElementById('platform').value;
            var filter = document.getElementById('filter').value;
            var url = '';

            // Hata kontrolleri
            if (!keyword) {
                alert("Lütfen bir arama terimi girin!");
                return;
            }

            if (platform === '') {
                alert("Lütfen bir arama platformu seçin!");
                return;
            }

            if (filter === '') {
                alert("Lütfen bir filtreleme seçeneği seçin!");
                return;
            }

            // Sayfa numarasını URL'ye ekleyin
            if (platform === 'github') {
                url = 'https://api.github.com/search/repositories?q=' + keyword + '&page=' + currentPage;
            } else if (platform === 'reddit') {
                url = 'https://www.reddit.com/search.json?q=' + keyword + '&page=' + currentPage;
            } else if (platform === 'npmjs') {
                url = 'https://api.npms.io/v2/search?q=' + keyword + '&page=' + currentPage;
            } else if (platform === 'stackoverflow') {
                url = 'https://api.stackexchange.com/2.2/search?order=desc&sort=activity&intitle=' + keyword + '&site=stackoverflow&page=' + currentPage;
            }

            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('API sorgusu başarısız!');
                    }
                    return response.json();
                })
                .then(data => {
                    var results = '<br> <h2>' + platform.charAt(0).toUpperCase() + platform.slice(1) + ' Results</h2>';
                    results += '<div class="row">';
                    if (platform === 'github') {
                        data.items.forEach(item => {
                            results += '<div class="col-md-6">';
                            results += '<div class="card mt-3">';
                            results += '<div class="card-body">';
                            results += '<h5 class="card-title"><a href="' + item.html_url + '">' + item.name + '</a></h5>';
                            results += '<p class="card-text">' + item.description + '</p>';
                            results += '<p class="card-text">Yıldız Sayısı: ' + item.stargazers_count + '</p>';
                            results += '<p class="card-text">Author: ' + item.owner.login + '</p>';
                            results += '</div></div></div>';
                        });
                    } else if (platform === 'reddit') {
                        data.data.children.forEach(item => {
                            results += '<div class="col-md-6">';
                            results += '<div class="card mt-3">';
                            results += '<div class="card-body">';
                            results += '<h5 class="card-title"><a href="https://www.reddit.com' + item.data.permalink + '">' + item.data.title + '</a></h5>';
                            results += '<p class="card-text">' + item.data.selftext + '</p>';
                            results += '<p class="card-text">Oy Sayısı: ' + item.data.ups + '</p>';
                            results += '<p class="card-text">Author: ' + item.data.author + '</p>';
                            results += '</div></div></div>';
                        });
                    } else if (platform === 'npmjs') {
                        data.results.forEach(item => {
                            results += '<div class="col-md-6">';
                            results += '<div class="card mt-3">';
                            results += '<div class="card-body">';
                            results += '<h5 class="card-title"><a href="https://www.npmjs.com/package/' + item.package.name + '">' + item.package.name + '</a></h5>';
                            results += '<p class="card-text">' + item.package.description + '</p>';
                            results += '<p class="card-text">Indirilme Sayısı: ' + item.package.downloads.last30Days + '</p>';
                            results += '<p class="card-text">Author: ' + item.package.author.name + '</p>';
                            results += '</div></div></div>';
                        });
                    } else if (platform === 'stackoverflow') {
                        data.items.forEach(item => {
                            results += '<div class="col-md-6">';
                            results += '<div class="card mt-3">';
                            results += '<div class="card-body">';
                            results += '<h5 class="card-title"><a href="' + item.link + '">' + item.title + '</a></h5>';
                            results += '<p class="card-text">' + item.body + '</p>';
                            results += '<p class="card-text">Author: ' + item.owner.display_name + '</p>';
                            results += '</div></div></div>';
                        });
                    }
                    results += '</div>';
                    document.getElementById('results').innerHTML = results;
                    // Sayfayı göster ve sayfalama düğmelerini göster
                    document.getElementById('results').style.display = 'block';
                    document.getElementById('pagination-buttons').style.display = 'block';
                    // Sonuç yoksa hata mesajını göster
                    if (data.total_count === 0) {
                        document.getElementById('error-message').style.display = 'block';
                    } else {
                        document.getElementById('error-message').style.display = 'none';
                    }
                })
                .catch(error => {
                    alert('Bir hata oluştu: ' + error.message);
                });
        }

        // Önceki sayfayı yükle
        document.getElementById('prev-page').addEventListener('click', function () {
            if (currentPage > 1) {
                currentPage--;
                loadResults();
            }
        });

        // Sonraki sayfayı yükle
        document.getElementById('next-page').addEventListener('click', function () {
            currentPage++;
            loadResults();
        });

        // İlk sonuçları yükle
        document.getElementById('search-box').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                currentPage = 1;
                loadResults();
            }
        });
            
      document.getElementById('search-button').addEventListener('click', function () {
    currentPage = 1;
    loadResults();
    });