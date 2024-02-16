// Ожидание полной загрузки страницы
window.onload = function() {
    // Проверяем текущий URL страницы
    if (/^https:\/\/www\.dream-singles\.com\/members\/messaging\/compose/.test(window.location.href)) {

        // Функция для обработки ответа от сервера и обновления профиля на странице
        function handleProfileResponse(response) {
            if (response.trim() !== "null") {
                // Парсим JSON ответа
                var responseData = JSON.parse(response);

                // Перебираем данные из ответа
                responseData.forEach(function(data) {
                    var info = data.info;

                    // Находим div с id = profile-blk-id
                    var profileBlock = document.getElementById('profile-blk-id');

                    // Проверяем, что profileBlock существует
                    if (profileBlock) {
                        // Создаем новый элемент с информацией от сервера
                        var newElement = document.createElement('div');
                        newElement.classList.add('custom-info-compose');
                        newElement.style.flex = '1';
                        newElement.style.display = 'flex';
                        newElement.style.alignItems = 'center';
                        newElement.style.paddingLeft = '20px';
                        newElement.style.paddingRight = '20px';
                        var textNode = document.createTextNode(info);
                        newElement.appendChild(textNode);

                        profileBlock.parentNode.insertBefore(newElement, profileBlock.nextSibling);
                    }
                });
            }
        }
        
        // Находим элемент div с id=imgCont
        var imgContDiv = document.querySelector('div#imgCont');

        // Проверяем, что элемент imgContDiv существует
        if (imgContDiv) {
            // Находим элемент a с атрибутом target=profile_6374429
            // Находим ссылку с атрибутом target, начинающимся с "profile_"
            var profileLink = imgContDiv.querySelector('a[target^="profile_"]');
            
            // Проверяем, что profileLink существует и имеет атрибут target
            if (profileLink && profileLink.getAttribute('target')) {
                // Получаем значение атрибута target
                var targetValue = profileLink.getAttribute('target');
                
                // Извлекаем только цифры из значения атрибута target
                var idPerson = targetValue.match(/profile_(\d+)/);

                // Проверяем, что удалось извлечь idPerson
                if (idPerson && idPerson[1]) {
                    // Отправляем id на сервер
                    var xhrProfile = new XMLHttpRequest();
                    xhrProfile.open("POST", "https://dreammatebot.space/api/ds_person_get_info", true);
                    xhrProfile.setRequestHeader("Content-Type", "application/json");
                    xhrProfile.onreadystatechange = function () {
                        if (xhrProfile.readyState === 4) {
                            if (xhrProfile.status === 200) {
                                // Обрабатываем ответ от сервера
                                handleProfileResponse(xhrProfile.responseText);
                            } else {
                                // В случае ошибки выводим сообщение об ошибке в консоль
                                console.error("Ошибка запроса:", xhrProfile.status);
                            }
                        }
                    };
                    xhrProfile.send(JSON.stringify([parseInt(idPerson[1])]));
                }
            }
        }
    } else {

        // Находим все элементы с классом "message-list-item"
        var messageItems = document.querySelectorAll('.message-list-item');
        
        // Создаем пустой Set для хранения уникальных цифровых значений
        var idPersonSet = new Set();

        // Перебираем найденные элементы
        messageItems.forEach(function(item) {
            // Находим внутри каждого элемента ссылку с классом "profile-link"
            var profileLink = item.querySelector('a.profile-link');
            
            // Проверяем, что ссылка существует и имеет атрибут "href"
            if (profileLink && profileLink.getAttribute('href')) {
                // Получаем значение атрибута "href"
                var targetValue = profileLink.getAttribute('href');
                
                // Извлекаем только цифры из значения атрибута "href"
                var idPerson = targetValue.match(/\/(\d+)\.html/);

                // Добавляем уникальные цифры в Set
                if (idPerson) {
                    idPersonSet.add(idPerson[1]);
                }
            }
        });

        // Обработка ответа от сервера
        function handleServerResponse(response) {
            if (response.trim() !== "null") {
                // Парсим JSON ответа
                var responseData = JSON.parse(response);

                // Перебираем данные из ответа
                responseData.forEach(function(data) {
                    var id = data.id;
                    var info = data.info;
                    // Находим все элементы с классом profile-link и href равным "/id.html"
                    var profileLinks = document.querySelectorAll('a.profile-link[href="/' + id + '.html"]');
                    profileLinks.forEach(function(profileLink) {
                        // Проверяем, содержит ли найденный элемент тег img
                        var imgElement = profileLink.querySelector('img');
                        if (imgElement) {
                            var parentMessageItem = profileLink.closest('.message-list-item');
                            if (parentMessageItem) {
                                // Создаем новый элемент div с информацией от сервера
                                var newElement = document.createElement('div');
                                newElement.classList.add('custom-info');

                                // Создаем текстовый узел с содержимым
                                var textNode = document.createTextNode(info);

                                // Проверяем ширину экрана
                                if (window.innerWidth < 768) {
                                    newElement.style.marginRight = '15px';
                                    newElement.style.marginLeft = '25px';
                                    newElement.style.marginBottom = '20px';
                                    newElement.style.marginTop = '10px';
                                } else {
                                    newElement.style.flex = '1';
                                    newElement.style.display = 'flex';
                                    newElement.style.alignItems = 'center';
                                    newElement.style.paddingLeft = '10px';
                                    newElement.style.paddingRight = '10px';
                                }

                                // Добавляем текстовый узел внутрь нового элемента
                                newElement.appendChild(textNode);

                                // Находим третьего ребенка элемента parentMessageItem
                                var thirdChild = parentMessageItem.children[2];

                                // Вставляем новый элемент после третьего ребенка элемента parentMessageItem в DOM-дереве
                                if (thirdChild) {
                                    parentMessageItem.insertBefore(newElement, thirdChild.nextSibling);
                                }
                            }
                        }
                    });
                });
            }
        } 


        // Преобразуем Set обратно в массив для отправки на сервер
        var idPersonArray = Array.from(idPersonSet);
        console.log("собранные id");
        console.log(idPersonArray);

        // Преобразуем массив строк в массив целых чисел
        var idPersonArrayInt = idPersonArray.map(function(id) {
            return parseInt(id);
        });
        
        // Отправка запроса на сервер
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://dreammatebot.space/api/ds_person_get_info", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    // Обрабатываем ответ от сервера
                    handleServerResponse(xhr.responseText);
                } else {
                    // В случае ошибки выводим сообщение об ошибке в консоль
                    console.error("Ошибка запроса:", xhr.status);
                }
            }
        };
        xhr.send(JSON.stringify(idPersonArrayInt));
    }
};