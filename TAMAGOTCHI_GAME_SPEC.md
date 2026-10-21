# CREATE YOUR PET — TAMAGOTCHI_GAME_SPEC

Версия 1.0 · 12 октября 2026 · статус: спецификация для проверки.

Документ полностью определяет будущую локальную браузерную игру. На текущем этапе создаётся только этот Markdown. HTML, CSS, JavaScript, SVG и рабочая игра будут созданы после отдельной команды пользователя. Описанные ниже пути — будущие файлы, а не уже выполненная реализация.

## 1. Project Overview

CREATE YOUR PET — образовательная игра-конструктор виртуального питомца; MY TAMAGOTCHI остаётся альтернативным рабочим названием. Один браузер, одно общее устройство, 1–4 ученика по очереди. Каждый создаёт животное, комнату, распорядок и, во втором режиме, профиль свободного времени. Финал — устное представление и сравнение.

Это завершённая учебная мини-игра без аккаунтов, сервера, сетевого мультиплеера и обязательного интернета. Нет голода, смерти питомца, таймеров ухода, экономики, штрафов, ежедневных обязательств или рейтинга учеников. Мотивация: собственный персонаж, немедленная визуальная реакция, завершённая карточка и общение.

Основной стек будущей реализации: HTML, CSS, Vanilla JavaScript, собственные SVG. Canvas допускается только для необязательного PNG-экспорта. Никаких stock images, внешних image-generation API, emoji вместо иллюстраций, CDN, внешних шрифтов или ассетов от пользователя.

## 2. Pedagogical Goal

Ученики выбирают содержание самостоятельно, затем описывают питомца в Present Simple и находят сходства и различия. Педагогическая последовательность: выбор знакомого действия → визуальная привязка к времени/частоте → краткий образец → самостоятельное высказывание по подсказкам → вопросы партнёру.

Программа проверяет целостность выбранных данных, а не произношение или качество устного ответа. Учитель слушает и даёт обратную связь. Нет микрофона, распознавания речи и автоматической оценки speaking. На создание одного питомца ориентировочно 5–8 минут: дизайн 1–2, routine 2–3, hobbies 1–2, просмотр около 1 минуты. Это ориентир, не ограничение. На группу из четырёх создание может занять 20–32 минуты; для короткого урока учитель сокращает дизайн через готовые настройки комнаты. Speaking и comparison требуют отдельного времени.

## 3. Target Age

Возраст 8–13 лет. Стилизованные животные и уютная игровая среда должны нравиться детям и подросткам независимо от пола. Крупные, но не младенческие персонажи; никакой гендерной маркировки тем, аксессуаров или цветов.

## 4. CEFR Level

Интерфейс и учебные фразы рассчитаны на A1–A2. Daily Routine — для освоивших базовые действия и целые часы; Routine + Hobbies — для более широкого словаря и наречий частоты. Это ориентир содержания, не система определения уровня или сертификации. Вся видимая игра, ошибки, диалоги, подписи и доступные названия — только на простом английском. Русский язык используется только в этой технической спецификации.

## 5. Present Simple Focus

Основной фокус — третье лицо единственного числа: `Milo gets up. It has breakfast.` Вопросы: `What time does it get up?`, `What does it do?`, `How often does it read books?` После `does` используется исходный глагол. Сравнение вводит отдельно множественное число: `Both pets get up...`, `They both play...`; здесь нельзя применять третье лицо единственного числа.

Питомец действует в условном учебном мире: fox может go to school, но визуально остаётся четвероногим животным. Действия представлены иконками, а не сценами с человеческими телами животных.

## 6. Game Modes

| ID | Название в UI | Routine | Hobbies | Время |
|---|---|---|---|---|
| `daily` | Daily Routine | 6–10 действий | Нет | Целые часы 06–22 |
| `hobbies` | Routine + Hobbies | 6–10 действий | 3–6 записей с частотой | Те же целые часы |

Режим и число участников фиксируются после START. Их изменение требует START AGAIN с подтверждением, чтобы не потерять несовместимые данные. Во втором режиме дробные часы тоже не вводятся: сложность добавляют словарь и frequency, а не новая система времени.

## 7. Daily Routine Mode

Доступны 16 действий из таблицы §9 с меткой R. Пользователь выбирает 6–10 различных действий и целый час для каждого. Любой набор из библиотеки допустим; обязательных get up или go to school нет. Нет hobbies, наречий частоты или дополнительных учебных экранов. Финал содержит MY DAY, visual prompts и, при нескольких игроках, сравнение routine и дизайна.

## 8. Routine + Hobbies Mode

Routine строится из тех же 16 действий. Затем открывается FREE TIME с 19 hobbies из §9: 12 дополнительных и 7 общих. Выбираются 3–6 различных записей; каждая получает always/often/sometimes/never. Отдельное время hobby не задаётся. Одно действие может присутствовать в routine и hobbies: `reads books at 5 o’clock` и `often reads books` описывают разные свойства; не объединять и не считать их ошибкой.

Необязательное поле `favouriteHobbyId` выбирается из уже отмеченных hobbies с частотой, отличной от never. Можно оставить пустым. При смене любимого hobby на never выбор любимого сбрасывается с сообщением. После hobby builder показывается предложение выбрать favourite, но завершение не блокируется.

## 9. Vocabulary Inventory

R = routine обоих режимов; H = hobbies только режима `hobbies`. В UI карточек показывать исходную форму. Сохранить знакомую ученикам подпись `brush my teeth`, но не подставлять её буквально в рассказ. `basePhrase` для этого действия — `brush {possessive} teeth`.

| activityId / имя SVG без расширения | label | thirdPerson template | Доступ | Иллюстрация |
|---|---|---|---|---|
| get_up | get up | gets up | R | кровать и солнце |
| get_dressed | get dressed | gets dressed | R | сложенная одежда |
| have_breakfast | have breakfast | has breakfast | R | миска каши и солнце |
| brush_teeth | brush my teeth | brushes {possessive} teeth | R | щётка и паста |
| go_to_school | go to school | goes to school | R | рюкзак и школьное здание |
| have_lunch | have lunch | has lunch | R | lunchbox |
| play_in_park | play in the park | plays in the park | R | дерево и мяч |
| have_dinner | have dinner | has dinner | R | тарелка и луна |
| go_to_bed | go to bed | goes to bed | R | кровать и луна |
| go_swimming | go swimming | goes swimming | R,H | очки и вода |
| read_books | read books | reads books | R,H | раскрытая книга |
| play_tennis | play tennis | plays tennis | R,H | ракетка и мяч |
| watch_tv | watch TV | watches TV | R,H | телевизор |
| play_board_games | play board games | plays board games | R,H | доска и кубик |
| play_computer_games | play computer games | plays computer games | R,H | контроллер |
| play_football | play football | plays football | R,H | футбольный мяч |
| chat_online | chat online | chats online | H | экран с двумя bubbles |
| listen_to_music | listen to music | listens to music | H | наушники и нота |
| read_magazines | read magazines | reads magazines | H | журнал |
| go_for_bike_ride | go for a bike ride | goes for a bike ride | H | велосипед |
| hang_out_with_friends | hang out with friends | hangs out with friends | H | три силуэта животных |
| write_blog | write a blog | writes a blog | H | ноутбук и карандаш |
| make_videos | make videos | makes videos | H | камера и play |
| make_cakes | make cakes | makes cakes | H | кекс и венчик |
| take_photos | take photos | takes photos | H | фотоаппарат |
| play_instrument | play an instrument | plays an instrument | H | гитара |
| go_shopping | go shopping | goes shopping | H | сумка |
| download_songs | download songs | downloads songs | H | нота и стрелка вниз |

Итого 28 уникальных действий, 16 routine, 19 hobbies. Download songs — только учебная карточка: игра не скачивает музыку и не открывает сайты.

## 10. Time System

В данных хранится целое `time` 6–22 включительно, означающее час в 24-часовой системе; минутного поля нет. Отображение: `hour12 = time % 12 || 12`, затем `7 o’clock`. Ни `7:15`, ни quarter/half past, ни минуты, ни цифровые `7:00` в ученическом интерфейсе не используются, включая timeline и экспорт.

Чтобы различать 7 утра и 7 вечера, time picker делится на MORNING (6–11), AFTERNOON (12–17), EVENING (18–22). Карточка показывает `7 o’clock` и текст `Morning`/`Evening`; маленькое солнце/луна дополняет текст. Timeline сохраняет эти подписи. Это не AM/PM-урок, а визуальное уточнение.

По умолчанию предложения: `Milo gets up at 7 o’clock.` В доступных описаниях и при явно неоднозначном сравнении можно использовать `in the morning`, `in the afternoon`, `in the evening` после времени. Для 12:00 внутреннее значение 12, UI `12 o’clock`, AFTERNOON. При сравнении time=7 и time=19 — DIFFERENT, даже если подпись часа совпадает.

Аналоговые часы: минутная стрелка строго на 12, часовая на `(time % 12) * 30` градусов. У часов всегда есть текстовое время и часть дня. Timeline сортируется по time, при равенстве — по порядку добавления. Два действия в один час разрешены; показывать `Same time` как нейтральную подсказку. Нелогичный сюжет допускается ради творческого выбора, обязательна только корректная структура.

## 11. Frequency System

Допустимые значения: `always`, `often`, `sometimes`, `never`. Визуальный код — 4 точки: 4/3/1/0 заполненных соответственно, плюс слово и выделенная кнопка. Точки показывают относительную частоту, не числовые проценты или расписание. Для never дополнительно тонкий перечёркнутый значок, но и слово остаётся.

Новая hobby-запись имеет `frequency: null` в черновике до выбора. Она не может быть сохранена в готовом питомце. Отсутствующая запись означает «не указано», а не never. `never` — осознанно выбранный факт и полноценная запись, которая учитывается в минимуме 3 hobbies.

## 12. PRESENT SIMPLE GRAMMAR ENGINE

Надёжный источник — explicit phrase mapping из §9 и §13, а не добавление `s` к строке. Генератор — чистые функции без изменения session. Вход: проверенный pet, activityId, time/frequency; выход: строка либо контролируемая ошибка `UNKNOWN_ACTIVITY`.

Система ссылок: имя в первом предложении каждого блока, далее `It`. `pronoun` фиксирован как `it`; дополнительного выбора he/she нет, чтобы не увеличивать число решений. Притяжательное местоимение всегда `its` без апострофа; `it's` означало бы it is. Вопросы и prompts также используют it/its. Имя никогда не склоняется и не используется как HTML.

Контракты будущих функций:

- `thirdPerson(activityId, pronoun)` возвращает explicit template с `{possessive}` → `its`.
- `basePhrase(activityId, reference)` возвращает исходную фразу; для вопроса brush teeth подставляется its, для both pets — their.
- `routineSentence(pet, entry, useName)` → `Milo has breakfast at 8 o’clock.`
- `hobbySentence(pet, entry, useName)` → `It often listens to music.` Наречие стоит перед смысловым глаголом, включая never.
- `question(activityId, kind)` → `What time does it have breakfast?` либо `How often does it listen to music?` — does + base.
- `pluralStarter(activityId)` при раскрытии учебной подсказки → `Both pets have breakfast...`, исходная форма; полного сравнения не генерирует.

`never` не превращается в doesn't: `It never writes a blog.` Не допускать `doesn't never`, `does goes`, `Both pets goes`, `has breakfasts`, `brushes my teeth`. Отрицание с doesn't не является обязательной механикой этой версии.

Профиль генерирует отдельные краткие предложения, не готовый монолог. Presentation и comparison по умолчанию скрывают полные предложения. Отображать грамматические окончания в подсказке можно через отдельные span, но текст и смысл доступны без цвета.

## 13. Third Person Phrase Mapping

Полные 28 соответствий заданы в §9 и являются обязательной реализационной таблицей. Дополнительные правила для разработчика:

| Исходный глагол | 3rd person | Примечание |
|---|---|---|
| get | gets | фразовый хвост сохраняется |
| have | has | исключение для всех трёх meals |
| go | goes | school, bed, swimming, shopping, bike ride |
| brush | brushes | плюс замена my → its |
| watch | watches | окончание -es |
| play | plays | перед y гласная, не plaies |
| read / listen / chat | reads / listens / chats | хвост без изменений |
| write / make / take | writes / makes / takes | не добавлять лишнее e |
| hang out | hangs out | изменяется только hang |
| download | downloads | хвост songs сохраняется |
| ride | rides | справочное правило; текущая карточка go for a bike ride использует goes |

Для будущего `study` потребуется explicit `studies`, для `do` — `does`; они не добавляются в текущую библиотеку автоматически. Новое действие должно иметь basePhrase, thirdPerson и собственную иконку, иначе validation каталога блокирует его включение. Не строить формы по отображаемой label.

## 14. Number of Players

`numberOfPlayers` — 1, 2, 3 или 4. `currentPlayer` — номер 1-based; массив pets хранит только подтверждённых питомцев с уникальными playerNumber. Каждый номер — ровно один pet, id стабилен при редактировании. UI: `Player 2 of 4`; полоска PET 1 ✓, PET 2 ..., PET 3 ..., PET 4 ... с текстовым доступным состоянием.

Игроки пользуются одним устройством и передают очередь; синхронизации разных браузеров нет. Имена учеников не собираются. Одинаковые имена питомцев разрешены, различать их подписью `Player 1` и стабильным id.

## 15. Individual Mode

START → creator → profile → SAVE PET → PRESENT YOUR PET. После сохранения можно вернуться к profile и EDIT. Нет NEXT PLAYER, выбора пары, compare или multiplayer progress. Случайный питомец для сравнения исключён из первой версии: основная задача — рассказ о собственном питомце.

## 16. Pair Mode

Player 1 создаёт и сохраняет питомца → экран передачи очереди NEXT PLAYER → Player 2 → MEET THE PETS. В gallery кнопка COMPARE сразу открывает единственную пару, также доступен PRESENT для каждого. Ученик A рассказывает, B задаёт вопрос, затем меняются ролями. Учитель может попросить 2 same и 2 different, но программа не требует, чтобы такие факты обязательно существовали.

## 17. Group Mode

3–4 ученика последовательно создают своих pets. После последнего — gallery, выбор любых двух различных id, compare, BACK TO PETS, новая пара. Для трёх участников возможны 3 пары, для четырёх 6. Нет турнирной сетки и рейтинга. Очередь speaking задаёт учитель; можно представить питомца из gallery без сравнения.

## 18. Full Game Flow

```text
START: player count → learning mode → START
  → CHOOSE A PET
  → WHAT IS YOUR PET’S NAME?
  → CUSTOMISE YOUR PET
  → CHOOSE A BOWL
  → CHOOSE A TOY
  → CHOOSE A ROOM (+ optional room details)
  → BUILD ITS DAY
  → [FREE TIME, только hobbies]
  → MEET YOUR PET (review) → SAVE PET
      → [NEXT PLAYER → повтор creator, если остались участники]
      → [MEET THE PETS, если 2–4 участника]
      → PRESENT YOUR PET / COMPARE (2–4) / EDIT
```

Каждый creator step имеет BACK/NEXT, сохранённый выбор и live preview; на первом шаге BACK возвращает к setup только до первого SAVE PET, с подтверждением при изменённом черновике. В последующих очередях вместо выхода в setup используется `Back to pets`, если есть готовые pets. Preview не считается сохранением. SAVE PET валидирует полный объект и только затем атомарно добавляет/заменяет его.

EDIT открывает копию выбранного pet на шаге выбора животного. SAVE CHANGES заменяет объект по id и возвращает на исходный экран (gallery/profile/presentation). CANCEL EDIT сохраняет исходный pet, требует подтверждения только при изменениях. Редактирование не двигает очередь, не добавляет участника и не очищает остальных. Если редактирование открыто из gallery до завершения всех игроков, незаконченный creator draft сохраняется отдельно и восстанавливается после выхода.

## 19. Start Screen

Название CREATE YOUR PET, собственная композиция из cat/dog/fox в комнатах, краткий текст `Make a pet. Build its day. Tell us about it.`. Радиогруппа `How many pets are we creating?` с 1–4; радиогруппа двух learning modes с короткими описаниями. Начальные значения: 1, Daily Routine. START начинает новый session.

Если найдена корректная сохранённая сессия: RESUME GAME и START AGAIN; начало заново требует диалог `Start again? Your pets will be removed.` → KEEP PLAYING / START AGAIN. Загрузка страницы сама по себе никогда не сбрасывает pets.

## 20. Pet Selection

Шесть животных: cat, dog, fox, rabbit, raccoon, red panda. Сетка одинаковых карточек с подписью; выбор виден по рамке, check и тексту Selected. Preview крупнее карточек. Начальный выбор cat, но пользователь может изменить. Смена вида сохраняет имя, routine, hobbies, предметы; аксессуары автоматически позиционируются по новым species anchors, а не сбрасываются.

## 21. Pet Naming

Prompt `What is your pet’s name?`; поле 1–20 Unicode code points после trim и свёртки повторных пробелов. Разрешены буквы любых алфавитов, цифры, внутренние пробелы, дефис и апостроф; хотя бы одна буква/цифра, без переносов, управляющих символов и разметки. Пустое поле: `Give your pet a name.`; длина: `Use 20 characters or fewer.`; недопустимые знаки: `Use letters, numbers, spaces, - or '.`.

Placeholder `Milo`, не автосохранённое имя. В шапке не переводить введённое имя в uppercase программно. DOM — textContent. Длинное имя переносится в карточке, поле хранит полную строку. Имена могут повторяться.

## 22. Pet Customisation

Две независимые группы: NECK и HEAD. NECK: none, teal collar, mustard collar, striped collar, sage bandana, terracotta bandana, checked bandana (6 дизайнов + none). HEAD: none, cap, headphones, beanie. Bow tie здесь отнесён к neck не добавляется: набор остаётся компактным и не требует дополнительной категории.

По умолчанию neck/head none. Одновременно не более одного элемента каждой группы. Все 6 видов совместимы со всеми вариантами. Нет human clothing, платьев, человеческих туловищ и гендерных комплектов. Цвет шерсти фиксируется по виду; дополнительного recolour builder нет. Выражения neutral/happy/excited — реакция UI, не обязательное решение ученика.

## 23. Bowl Selection

Пять вариантов: ceramic (cream), striped (blue/cream), paw print (terracotta), modern (dark teal), colourful (mustard/sage). Default ceramic. Одна миска на pet, нужна в preview, profile и gallery; в comparison считается предметом дизайна. Не меняет hunger или игровую статистику.

## 24. Toy Selection

Шесть: ball, rope, teddy, squeaky toy (стилизованная резиновая утка), puzzle toy, little mouse. Default ball. Одна игрушка, в UI `Choose a toy.`; в gallery `Favourite toy`. Разные виды могут выбрать любую игрушку. Игрушка не определяет hobbies и не навязывает routine.

## 25. Room Selection

Шесть тем: Cozy Room, Gamer Room, Forest Room, Space Room, Sporty Room, Creative Room. Default cozy. Различия не только в оттенке: мебель и настенный мотив разные. После выбора открывается необязательное `Room details`: bed (cushion/basket/oval), rug (round/striped/leaf), wall decoration (moon/mountain/abstract). По умолчанию cushion, round, moon. Эти три решения доступны через один компактный блок; их можно пропустить.

Смена темы сохраняет выбранные bed/rug/wall decoration. Тематические furniture/decor остаются частью темы; дополнительное украшение занимает выделенное место и не перекрывает theme decor. Пользователь не перетаскивает мебель, не редактирует координаты и не загружает фон.

## 26. Daily Routine Builder

Две области: библиотека activity cards и MY DAY timeline; крупный preview остаётся виден. Действие выбирается, затем открывается простая панель часов из §10. После выбора появляется одна строка timeline с иконкой, label, часом и частью дня. Нажатие времени редактирует его, REMOVE удаляет запись. Карточка уже добавленного действия переводит к строке, не создаёт дубликат.

Над timeline `Choose 6–10 activities.` и счётчик `6 of 10`. NEXT доступна при 6–10 полных записей. При десяти карточки новых действий имеют disabled состояние и пояснение `You have 10 activities. Remove one to add another.`. Черновик без времени не засчитывается, показывается `Choose a time.`. Для уменьшения кликов: после выбора часа picker закрывается и возвращает фокус на действие.

Никакого обязательного drag-and-drop. Автоматическая сортировка по внутреннему часу. Равные часы сохраняют устойчивый порядок добавления. До NEXT данные записываются в draft, но готовый pet не меняется.

## 27. Hobby Builder

Prompt `What does your pet do in its free time?`, счётчик `Choose 3–6 activities.`. 19 hobby cards с отдельным переключателем выбранности; для выбранной — четыре кнопки frequency в радиогруппе `How often?`. Повторное нажатие на карточку не должно случайно удалить frequency: удаление через REMOVE. Для шестой выбранной записи новые варианты disabled с пояснением.

NEXT требует 3–6 hobbies с допустимой frequency. No default frequency: выбор наречия — учебное действие. После выбора видны точки и слово. Необязательный favourite select содержит только выбранные hobbies, не never, и `No favourite yet`. Если все hobbies имеют never, favourite скрыт и вопрос favourite в presentation не показывается. Результат не интерпретируется как реальный образ жизни ребёнка.

## 28. Final Pet Profile

`Meet Milo!`: scene и краткие разделы MY DAY / FREE TIME. По умолчанию видны 3 routine и 3 hobby facts (если есть), остальное раскрывается SHOW ALL; все записи доступны, ничего не отбрасывается. Routine сортирован по времени; hobbies — по порядку выбора. Первый факт каждого блока с именем, следующие с It. Нет одного длинного монолога.

Review до подтверждения: EDIT, SAVE PET. После подтверждения: PRESENT YOUR PET, EDIT; для нескольких игроков NEXT PLAYER или MEET THE PETS. SAVE PET при повторном нажатии идемпотентен. В готовой карточке показывать room, toy, player number, опциональный favourite hobby. Длинный контент прокручивается только в панели фактов, страница сохраняет понятную навигацию.

## 29. Presentation Mode

Большая сцена, имя, иконки действий с часами/частотой; полные generated sentences скрыты. Разделы YOUR PET / MY DAY / FREE TIME переключаются без потери контекста. По 1–3 вопроса на экран, кнопки NEXT PROMPT/BACK. `Show a hint` раскрывает sentence starter вроде `It gets up at...`, а не полный монолог. Для возврата доступна BACK TO PROFILE или BACK TO PETS в зависимости от источника.

Хранится лишь активный prompt index, прогресс oral performance не записывается и не оценивается. В индивидуальном режиме весь цикл заканчивается presentation с возможностью EDIT/START AGAIN.

## 30. Meet All Pets

2 игрока — две карточки рядом; 3–4 — сетка 2×2 на широком экране. Карточка: scene, имя, Player N, room, toy, первые 2 routine facts и первые 2 hobby facts второго режима; VIEW открывает все, PRESENT и EDIT работают по id. Можно использовать три факта при достаточном месте, но базовая версия показывает два для одинаковой высоты.

До готовности всех участников частичная gallery показывает завершённые pets и кнопку CONTINUE PLAYER N, сравнение доступно только после готовности всех. Для 1 игрока gallery не используется. Изменение pet обновляет карточку немедленно после SAVE CHANGES.

## 31. Comparison Mode

В группе: `Choose two pets to compare.` → два разных id → COMPARE. При двух участниках выбор автоматический. Экран: две сцены, имя/Player N над каждой, вкладки MY DAY / FREE TIME (только hobbies) / LOOKS, фильтр ALL / SAME / DIFFERENT / NOT SHOWN. Под ними строки сопоставимых фактов и sentence starters `Both pets...`, `They both...`, `<name> ..., but <name> ...`.

Готовые предложения сравнения не генерируются. Показать исходную activity label, два часа или две частоты, state badge. Ученики строят предложение сами. Смена пары возможна через BACK TO PETS. Пара одинакового id недопустима; одинаковые имена допустимы и различимы по Player N.

## 32. Same / Different Logic

Сравнение — чистая функция `comparePets(left, right, mode)`, всегда пересчитывается из актуальных pets, не хранится в session как источник истины.

| Область | Ключ | SAME | DIFFERENT | NOT SHOWN |
|---|---|---|---|---|
| Routine | activityId | есть у обоих, time равен | есть у обоих, time разный | есть только у одного |
| Hobbies | activityId | есть у обоих, frequency равна | есть у обоих, frequency разная | есть только у одного |
| Looks | поле из списка ниже | значения равны | значения разные | не применяется для обязательных полей |

Перебирать объединение activityId, не пересечение и не позиции в массиве. Не показывать действие, отсутствующее у обоих. Совпадающее действие с разным временем получает secondary badge `Same activity`, primary DIFFERENT. `time=7` vs `19` — разные часы; обе части дня видны. `never` vs отсутствует — NOT SHOWN, а не SAME и не утверждение, что другой pet делает действие. Два never — SAME (общий факт отсутствия привычки), но не положительный интерес.

Looks сравнивает animalType, accessory.neck/head, bowl, toy, room.theme/bed/rug/wallDecoration. Имена не входят в same/different учебных черт. Нулевая категория показывает `No same facts yet.`/`No different facts yet.`. Не придумывать недостающие факты, не делать выводов об activity за пределами выбранного профиля. Внутреннее поле result: `{category, key, leftValue, rightValue, status, sharedActivity}`. Порядок routine/hobbies — каталог §9; looks — указанный список полей.

## 33. Speaking Prompts

| Контекст | Текст |
|---|---|
| Identity | What is its name? / What animal is it? |
| Look | What does it look like? / What room does it have? |
| Routine | What time does it get up? / What time does it go to bed? |
| Routine flexible | What does it do in the afternoon? / Tell us about its day. |
| Hobby | What does it often do? / What does it sometimes do? / What does it never do? |
| Favourite | What is its favourite hobby? |
| Comparison | What is the same? / What is different? / Both pets... / They both... |

Контекстные вопросы выбираются по реально существующим записям: get up/go to bed только если выбраны; often/sometimes/never только при наличии соответствующей frequency. При отсутствии подходящих фактов используются `What does it do in its free time?` и `How often?`. Favourite вопрос только при favouriteHobbyId. Учитель может устно задать другие вопросы; UI не заставляет говорить о несуществующих данных.

## 34. Visual Art Direction

Modern cosy cartoon game, мягкие формы и лёгкая ручная асимметрия без шумовых растров. Никаких огромных блестящих глаз, младенческих пропорций, обилия сердечек, розового default theme или acid colours. Иллюстрации законченные: характерный силуэт, мордочка, лапы, хвост, один слой мягкой тени.

| Token | Цвет | Назначение |
|---|---|---|
| cream | #F6F0E4 | фон приложения |
| paper | #FFFCF5 | карточки |
| sage | #96AE91 | поверхности, forest |
| muted-blue | #7E9DB5 | gamer, полосы |
| orange | #D98A49 | fox, акценты |
| terracotta | #BC7159 | аксессуары |
| mustard | #C5A04B | игрушки, украшения |
| dusty-red | #AD6865 | малые акценты |
| dark-teal | #234E52 | основной текст/outline |
| warm-grey | #6D675F | вторичный текст |

Текст в основном dark-teal на cream/paper. Цветные поверхности не подразумевают белый текст автоматически; контраст проверяется на фактических парах. Шрифт — локальный системный `Trebuchet MS`, `Segoe UI`, sans-serif, без сетевых запросов. Базовый размер 18px, заголовки 28–40px, радиусы карточек 18–24px, мягкая CSS-тень. UI spacing 8/12/16/24/32px.

## 35. Pet Art Rules

Все шесть животных сидят в лёгком ракурсе 3/4, голова смотрит к игроку, передние лапы на полу. Общие пропорции: голова около 40% высоты силуэта, тело около 45%, уши/лапки/хвост занимают остальное; rabbit получает длинные уши без человеческого туловища. У cat узкие уши и длинный хвост; dog висячие уши и короткая морда; fox острые уши и пушистый хвост с cream tip; rabbit длинные уши и короткий хвост; raccoon маска и полосатый хвост; red panda рыжая шерсть, светлая морда, кольчатый хвост.

SVG-группы: shadow, tail, body, paws, face, ears, eyes-neutral, eyes-happy, eyes-excited, mouth-neutral, mouth-happy, mouth-excited. Состояния меняют только глаза/рот и лёгкую позу, не требуют трёх полных файлов. Без обязательных деталей, обрезаемых краями viewBox.

## 36. SVG Strategy

SVG рисует coding agent вручную через path/ellipse/rect/polygon с общими токенами. Никаких внешних ресурсов, embedded bitmap или foreignObject. Каждое исходное SVG содержит title и корректный viewBox. Декоративная встроенная копия может быть aria-hidden, поскольку scene имеет собственное описание.

Питомцы `0 0 320 320`; scene и room layers `0 0 960 540`; neck/head `0 0 120 80`; миски/игрушки/room items `0 0 160 120`; activity icons `0 0 64 64`; UI symbols `0 0 24 24`. `preserveAspectRatio=xMidYMid meet`. Общий round cap/join; stroke pet 4, item 3, activity 2.5, UI 2 единицы. Это согласованные веса относительно размера, а не одинаковая числовая толщина на разных viewBox. Один теневой оттенок с opacity 0.12–0.18; свет сверху слева; без сложных фильтров.

Исходные SVG при сборке превращаются в локальный `art.generated.js` с проверенными symbol definitions. Это позволяет открывать index.html по file:// без fetch/import/CORS. Runtime создаёт scene как одно inline SVG из локального registry, ids получают уникальный префикс экземпляра для предотвращения конфликтов clipPath/gradient в gallery. Внешний sprite fetch и загрузка SVG текстом по сети не используются. Генератор — необязательный при запуске игры, нужен лишь разработчику для синхронизации исходников и registry.

Каждый pet metadata содержит anchors в собственной системе 320×320: neck `{x:160,y:180,width:100,height:65}`, head `{x:160,y:64,width:115,height:76}` как исходные ориентиры; species-specific таблицу агент обязан точно подогнать при отрисовке всех шести животных. Для rabbit head accessory крепится между основаниями ушей, не на кончики. Позиция элемента вычисляется из центра anchor: translate(x-w/2,y-h/2), scale(w/120,h/80). Ear masks/occlusion описываются metadata: шапка позади переднего ear-overlay, headphones могут частично находиться над ушами. Фронтальный ear-overlay копируется из той же геометрии pet, отдельного bitmap нет.

## 37. Room Layering System

В одном scene SVG, в порядке от дальнего к ближнему:

1. background: wall и окно, full scene.
2. floor: нижняя область y=340–540.
3. furniture: тема, фоновые предметы, справа/слева от центрального pet.
4. rug и bed: декоративный ковёр по центру, кроватка сбоку.
5. decor: тематический слой и выбранное wall decoration на стене.
6. pet: footprint x=320–640, y=185–505, с собственной тенью и accessory groups.
7. bowl: x=225,y=405,width=150,height=112.5.
8. toy: x=665,y=423,width=130,height=97.5.

Bed x=80,y=330,w=220,h=165; rug x=280,y=420,w=400,h=110 (может быть сплющен намеренно как плоскость); wall decoration x=690,y=75,w=150,h=112.5. Геометрия themes проектируется с этими свободными зонами. Furniture не заслоняет морду. У предметов прозрачный фон; theme background/floor покрывают сцену полностью по совокупности. Preview, profile, gallery и экспорт используют одну функцию composeScene, а не отдельные стили рисунка.

## 38. Complete Asset Inventory

Все файлы этого раздела создаёт coding agent при будущей реализации. Таблицы задают точный список, назначение, viewBox и прозрачность. Никакого запроса пользователю на pet.png или поиск картинок. `none` является отсутствием слоя и не требует SVG. CSS создаёт карточки, рамки, точки frequency, прогресс и тени UI; это не отдельные изображения.

### 38.1 Pets

Путь `assets/pets/`, каждый файл viewBox `0 0 320 320`, прозрачный фон; используется как основной pet symbol во всех сценах и карточках выбора, содержит 3 состояния лица.

| Файл | Содержание |
|---|---|
| pet_cat.svg | cream/grey cat, сидящий, длинный хвост |
| pet_dog.svg | warm brown dog, висячие уши |
| pet_fox.svg | orange fox, cream грудь/кончик хвоста |
| pet_rabbit.svg | grey rabbit, длинные уши |
| pet_raccoon.svg | grey raccoon, маска/полосатый хвост |
| pet_red_panda.svg | terracotta red panda, светлая морда |

### 38.2 Accessories

Путь `assets/accessories/`, все `0 0 120 80`, прозрачный фон; накладываются по neck/head anchors, также показаны в option cards.

| Файл | Содержание / слой |
|---|---|
| neck_collar_teal.svg | teal ошейник с маленьким жетоном / neck |
| neck_collar_mustard.svg | mustard ошейник / neck |
| neck_collar_striped.svg | blue/cream полосатый ошейник / neck |
| neck_bandana_sage.svg | однотонная sage косынка / neck |
| neck_bandana_terracotta.svg | terracotta косынка / neck |
| neck_bandana_checked.svg | cream/teal клетчатая косынка / neck |
| head_cap.svg | muted-blue кепка / head |
| head_headphones.svg | небольшие teal наушники / head |
| head_beanie.svg | mustard шапка / head |

### 38.3 Bowls and toys

Пути `assets/bowls/` и `assets/toys/`, все `0 0 160 120`, прозрачный фон; option cards и foreground scene.

| Файл | Содержание |
|---|---|
| bowl_ceramic.svg | cream керамическая миска с кормом |
| bowl_striped.svg | blue/cream полосатая миска с кормом |
| bowl_paw_print.svg | terracotta миска с собственным рисунком лапы |
| bowl_modern.svg | низкая teal миска с кормом |
| bowl_colourful.svg | mustard/sage миска с кормом |
| toy_ball.svg | orange/cream мяч |
| toy_rope.svg | двухцветная верёвка с узлами |
| toy_teddy.svg | небольшой тканевый медвежонок |
| toy_squeaky.svg | mustard резиновая утка |
| toy_puzzle.svg | плоская игрушка с выдвижными секциями |
| toy_mouse.svg | тканевая мышка с верёвочным хвостом |

Корм — встроенные в каждую миску общие SVG shapes из registry, отдельного selectable food asset нет.

### 38.4 Rooms

Для каждой строки создать ровно четыре файла в `assets/rooms/<theme>/`: `background.svg`, `floor.svg`, `furniture.svg`, `decor.svg`. Все viewBox `0 0 960 540`. Background закрашивает wall y=0–340 (остаток прозрачный); floor закрашивает y=340–540 (остаток прозрачный); furniture/decor полностью прозрачны вне предметов. По совокупности background+floor дают непрозрачную сцену. Назначение — соответствующие слои §37; room thumbnails получаются composeScene с default items, отдельные thumbnail картинки не нужны.

| theme | background | floor | furniture | decor |
|---|---|---|---|---|
| cozy | cream wall, дневное окно | warm wood boards | низкая полка с книгами, лампа | растение и маленькая рамка |
| gamer | muted-blue wall, окно | grey boards | низкий стол с экраном/контроллером | геометрические панели |
| forest | sage wall, окно с листьями | warm boards | деревянная полка, плетёный пуф | листья и горшок |
| space | dark-teal wall, окно со звёздами | muted-blue floor | низкая округлая полка | планеты и маленькая ракета |
| sporty | cream/blue wall, окно | светлое дерево | стойка для мячей, низкая скамья | маленький pennant и ракетка |
| creative | warm cream wall, окно | terracotta boards | столик с pencil cup, полка | бумажные цветовые формы |

Итого 24 room SVG. Перечисленные внутренние предметы рисуются группами внутри соответствующего файла и повторно не считаются отдельными selectable assets. Книги, лампа, стол, монитор, растения, пуф, ракета, мячи, скамья, ракетка, карандаши и окна не должны оставаться пустыми placeholder silhouettes.

### 38.5 Room details

Путь `assets/rooms/items/`, все `0 0 160 120`, прозрачный фон; выбираются в room details и занимают выделенные anchors §37.

| Файл | Содержание / назначение |
|---|---|
| bed_cushion.svg | мягкая овальная подушка / bed |
| bed_basket.svg | плетёная лежанка с подушкой / bed |
| bed_oval.svg | низкая овальная лежанка / bed |
| rug_round.svg | круглый sage ковёр / rug |
| rug_striped.svg | прямоугольный blue/cream ковёр / rug |
| rug_leaf.svg | ковёр формы листа / rug |
| wall_moon.svg | рамка с луной / wallDecoration |
| wall_mountain.svg | рамка с горами / wallDecoration |
| wall_abstract.svg | рамка с геометрическими фигурами / wallDecoration |

### 38.6 Activities

Путь `assets/activities/<activityId>.svg`: ровно 28 файлов по всем id §9. Каждый `0 0 64 64`, прозрачный фон. Содержание однозначно задано последним столбцом §9; назначения — activity cards, timeline, hobby cards, speaking prompts, comparison. Общие фрагменты bowls/books/controllers допускаются как SVG symbol reuse, но итоговая иконка каждого activityId обязательна.

### 38.7 UI

Путь `assets/ui/`, все `0 0 24 24`, прозрачный фон; используются только рядом с текстовой кнопкой или с accessible label.

| Файл | Назначение |
|---|---|
| arrow_left.svg | BACK |
| arrow_right.svg | NEXT / NEXT PLAYER |
| check.svg | selected, saved, SAME |
| close.svg | закрыть panel/modal |
| edit.svg | EDIT |
| trash.svg | REMOVE / START AGAIN |
| fullscreen.svg | FULL SCREEN |
| fullscreen_exit.svg | EXIT FULL SCREEN |
| compare.svg | COMPARE |
| speak.svg | PRESENT YOUR PET (speech bubble, без микрофона) |
| download.svg | необязательный DOWNLOAD PET CARD |
| sun.svg | morning/afternoon |
| moon.svg | evening |
| different.svg | DIFFERENT (две расходящиеся линии) |
| not_shown.svg | NOT SHOWN (короткое тире в рамке) |
| clock.svg | циферблат и динамические стрелки времени |

Часы — reusable symbol face плюс две inline линии, не 17 файлов. Start illustration составляется из существующих symbols. Итог: 7 pets + 9 accessories + 5 bowls + 6 toys + 24 room layers + 9 room details + 28 activities + 16 UI = **104 исходных SVG**. Все 104 планируются в обязательный pack; кнопка PNG-экспорта и её использование остаются необязательными.

## 39. Exact Proposed Folder Structure

Это будущая структура; сейчас существует только спецификация.

```text
MyPetDay/
  TAMAGOTCHI_GAME_SPEC.md
  README.md
  index.html
  styles.css
  js/
    catalog.js
    art.generated.js
    grammar.js
    validation.js
    state.js
    storage.js
    compare.js
    scene.js
    ui.js
    export.js                 # только при включении PNG-экспорта
    app.js
  assets/
    pets/                     # 6 файлов §38.1
    accessories/              # 9 файлов §38.2
    bowls/                    # 5 файлов §38.3
    toys/                     # 6 файлов §38.3
    rooms/
      cozy/                   # background/floor/furniture/decor.svg
      gamer/                  # те же 4 точных имени
      forest/                 # те же 4 точных имени
      space/                  # те же 4 точных имени
      sporty/                 # те же 4 точных имени
      creative/               # те же 4 точных имени
      items/                  # 9 файлов §38.5
    activities/               # 28 activityId.svg из §9
    ui/                       # 16 файлов §38.7
  tools/
    build-art.mjs             # dev-only: SVG → локальный JS registry
  tests/
    logic.test.mjs            # meaningful grammar/state/compare/storage cases
```

Runtime — обычные deferred scripts, общий namespace `window.PetGame`; не ES-module import, чтобы file:// не требовал local server. Порядок: catalog, art.generated, grammar, validation, state, storage, compare, scene, ui, optional export, app. tools/tests не нужны для открытия игры. README описывает двойной клик index.html, ограничения localStorage в браузере и отсутствие интернет-зависимостей. Никакого package installation для пользователя.

## 40. UI Components

| Компонент | Ответственность |
|---|---|
| AppShell | title, FULL SCREEN, START AGAIN, основной экран |
| PlayerProgress | очередь и текстовые saved/draft states |
| StepNavigation | текущий creator step, BACK/NEXT, доступность |
| OptionCard / OptionGroup | accessible radio selection и selected state |
| PetScene | единая SVG композиция и описание |
| NameField | имя, validation message |
| ActivityLibrary | карточки, selected/disabled состояния |
| HourPicker | группы времени и часы |
| RoutineTimeline | редактирование/удаление строк |
| FrequencyPicker | radio buttons и точки |
| PetProfile | короткие факты, SHOW ALL, действия |
| PetsGallery | карточки, CONTINUE, выбор пары |
| CompareTable | значения, badges, filters, starters |
| SpeakingPanel | визуальные prompts и hint |
| ConfirmDialog | reset/discard; управление фокусом |
| StatusMessage | сохранение/ошибки, aria-live |

Интерактивный компонент — native button/input/select, не кликабельный div. Полный rerender формы не должен терять курсор имени и фокус: обновлять scene отдельно, сохранять focus target по stable id. No tooltip-only instructions. UI не показывает технические id, stack traces, JSON или имена внутренних полей.

## 41. State Architecture

Единственный источник истины — session. Отдельно transient UI: открытый picker, сообщение, filter, focus target. Дом не является хранилищем. Изменения проходят через действия reducer/state controller и validation; scene/text/compare — производные представления.

Действия: START_SESSION, UPDATE_DRAFT, ADD_ROUTINE, SET_TIME, REMOVE_ROUTINE, ADD_HOBBY, SET_FREQUENCY, REMOVE_HOBBY, SET_FAVOURITE, GO_STEP, SAVE_PET, NEXT_PLAYER, OPEN_GALLERY, BEGIN_EDIT, SAVE_EDIT, CANCEL_EDIT, OPEN_PRESENTATION, SELECT_PAIR, OPEN_COMPARE, RESET_SESSION, RESTORE_SESSION.

SAVE_PET/SAVE_EDIT сначала валидируют копию, затем заменяют session единым присваиванием. Двойной клик SAVE не создаёт второй pet: upsert по id/playerNumber плюс disabled на время transition. NEXT_PLAYER допустим только после сохранения текущего номера и если номер меньше numberOfPlayers. Новый draft получает новый id, defaults и пустые routine/hobbies; ни один массив предыдущего pet не переиспользуется по ссылке.

На SAVE_EDIT currentPlayer не изменяется. `editDraft` и `draftPet` отдельны; edits не мутируют pets. При восстановлении проверять screen/currentStep: невозможный compare возвращается в gallery, недопустимый creator step — первый незавершённый. Навигационные параметры не могут обходить validation при сохранении.

## 42. Data Schemas

Ниже иллюстративная JSON-форма, не готовый файл приложения. В готовом pet минимум 6 routine и 3 hobbies второго режима; для компактности пример содержит сокращённые массивы.

```json
{
  "schemaVersion": 1,
  "sessionId": "session-local-001",
  "mode": "hobbies",
  "numberOfPlayers": 2,
  "currentPlayer": 1,
  "screen": "creator",
  "currentStep": "routine",
  "pets": [],
  "draftPet": {
    "id": "pet-local-001",
    "playerNumber": 1,
    "name": "Milo",
    "pronoun": "it",
    "animalType": "cat",
    "accessory": {"neck": "none", "head": "none"},
    "bowl": "ceramic",
    "toy": "ball",
    "room": {"theme": "cozy", "bed": "cushion", "rug": "round", "wallDecoration": "moon"},
    "routine": [{"activityId": "get_up", "time": 7}],
    "hobbies": [{"activityId": "listen_to_music", "frequency": "often"}],
    "favouriteHobbyId": "listen_to_music"
  },
  "editDraft": null,
  "editContext": null,
  "selectedPetIds": [],
  "presentation": {"petId": null, "section": "identity", "promptIndex": 0},
  "updatedAt": "2026-10-12T12:00:00.000Z"
}
```

`editContext` при редактировании: `{petId, returnScreen, returnStep}`. `draftPet` может быть null после финального SAVE. `editDraft` null вне editing. Списки selectedPetIds содержат только существующие уникальные id и максимум два элемента. ID генерируются локально; crypto.randomUUID при доступности, иначе timestamp+counter+random с проверкой уникальности. updatedAt — техническая UTC метка, не учебные часы питомца.

Инварианты готового pet: поля из разрешённых каталогов; имя по §21; pronoun=it; уникальные activityId внутри каждого массива; integer time 6–22; routine length 6–10; daily hobbies=[]/favourite=null; hobbies mode длина 3–6 и frequency не null; favourite ссылается на non-never hobby. В draft допустимы пустое имя, неполные массивы и null time/frequency; лимиты/разрешённые id соблюдаются всегда. В session 0–N pets, уникальные id и playerNumber 1–N, currentPlayer 1–N. Готовность всех — pets.length=N и полный набор playerNumber, а не сравнение currentPlayer с N.

## 43. Activity Data Structure

```js
// Контракт будущего каталога, не реализация.
{
  id: 'brush_teeth',
  label: 'brush my teeth',
  basePhrase: 'brush {possessive} teeth',
  thirdPerson: 'brushes {possessive} teeth',
  category: 'routine',
  availableInMode: ['daily', 'hobbies'],
  roles: ['routine'],
  icon: 'activity_brush_teeth',
  enabled: true,
  sortOrder: 4
}
```

Общие действия имеют category `free_time`, roles `['routine','hobby']`; дополнительные category `free_time`, roles `['hobby']`, availableInMode `['hobbies']`. Все каталоги animals/accessories/bowls/toys/rooms/roomItems/frequencies централизованы в catalog.js и содержат id, label, assetId. Каталог валидируется при запуске: уникальность id, наличие symbol, обязательных форм и минимального числа доступных вариантов.

Учитель позже может редактировать каталог в файле, не HTML; встроенного редактора словаря нет. Для исключения activity использовать enabled=false, сохраняя запись и mapping, чтобы старый pet продолжал отображаться. Добавление требует explicit mapping и нового SVG. Полное удаление id требует миграции сохранённых сессий; неизвестный id нельзя молча заменять другим.

## 44. Responsive Behaviour

Основная сцена 16:9, приложение не запирается в жёсткий 16:9 viewport. Desktop ≥1100px: preview около 40%, controls около 60%; timeline рядом с библиотекой при достаточном месте. 720–1099px: preview сверху или слева меньшего размера, карточки 2–3 в ряд. <720px: одна колонка, scene над панелью, кнопки доступны без горизонтального скролла; gallery одна колонка. Comparison на узком экране показывает два компактных заголовка и строки значений, не скрывает второго pet.

Целевые проверки 1366×768, 1920×1080, 1024×768, 768×1024, 390×844, browser zoom 200%. Минимальная цель касания 44×44 CSS px. Footer не перекрывает controls; scrolling разрешён на маленьких экранах. На interactive board — крупные карточки и отсутствие hover-only действий. Screen sharing не требует специального соединения: достаточно читаемого UI и full screen.

## 45. Fullscreen

FULL SCREEN через Fullscreen API для app root в прямом обработчике пользовательского клика. При fullscreenchange меняется подпись на EXIT FULL SCREEN. Esc использует нативное поведение, session не меняется. При unsupported API или отказе показать `Full screen is not available here.` и продолжить обычный responsive layout. Не считать fullscreen обязательным для прохождения игры; учитывать viewport resize.

## 46. Accessibility

Семантические заголовки, landmarks, label для input, radio groups с legend, aria-pressed только для независимых toggle buttons. Tab/Shift+Tab, Enter/Space, стрелки в radio groups; удаление/редактирование доступны без drag. Selected/SAME/DIFFERENT/frequency обозначаются словом и формой, не только цветом.

Focus indicator виден на всех поверхностях. Dialog захватывает фокус, Esc закрывает с сохранением, после закрытия фокус возвращается инициатору; reset не подтверждается Esc. Ошибки связаны с полем через aria-describedby, сводка первой ошибки получает фокус на SAVE. Live region сообщает `Pet saved.` без повторения всех фактов при каждом scene update.

Scene имеет краткое accessible description: `Milo, a cat in a cozy room, with a ball.`; вложенные decorative symbols aria-hidden. Часы имеют spoken label с частью дня. Проверить фактический контраст текста (обычный ≥4.5:1, крупный ≥3:1), interactive boundaries/focus ≥3:1. Поддержать prefers-reduced-motion, zoom 200%, чтение текста screen reader. Это цели приёмки, не заявление о уже проведённой сертификации.

## 47. Animations

Transitions 160–220ms, только opacity/transform. Выбор toy — один короткий pet bounce до 4px за 240ms; room — crossfade 180ms; SAVE — краткая happy реакция. Базовое состояние neutral, selected toy может excited; после 500ms возврат к neutral. Нет постоянного bouncing, flashing, auto-scroll, анимации текста или звука. Все реакции необязательны; reduced-motion отключает movement/crossfade и сразу показывает итог. Повторные клики прерывают предыдущую реакцию, не накапливают таймеры.

## 48. Local Storage Strategy

Основная сессия хранится в памяти, autosave — localStorage key `createYourPet.session.v1`, backup `createYourPet.session.backup.v1`. Записывать snapshot после каждого подтверждённого действия; ввод имени debounce 300ms, принудительный flush на navigation, SAVE, visibilitychange/pagehide. Сначала сериализовать и проверить snapshot, затем записать backup предыдущего корректного состояния и primary; все операции в try/catch. Ошибка backup не должна удалять working primary.

При запуске: читать primary → parse → проверить schema и полный набор инвариантов для completed pets/drafts → предложить RESUME. Если primary повреждён, проверить backup и показать `We found a saved game. Resume it?`. Некорректные raw значения никогда не рендерятся. Версия новее поддерживаемой: `This saved game cannot be opened here.`; не перезаписывать автоматически. Текущая версия без миграций, будущие требуют явных функций.

localStorage может быть недоступен, особенно при file:// или private mode. Игра продолжает в памяти; статус `Your game is saved for this tab only.` и beforeunload guard при наличии созданных/изменённых данных без надёжного сохранения. Нативный leave-page dialog зависит от браузера и не гарантирован. Для дополнительной защиты в этом случае предоставить `SAVE SESSION FILE` — локальную JSON-загрузку и `OPEN SESSION FILE` на start: те же схемы/validation, лимит файла 256 KB, замена активной сессии только с подтверждением. Это резерв состояния, отдельный от необязательной PNG-карточки.

RESET очищает только собственные primary/backup keys, не весь localStorage; выполняется после подтверждения. Сохранение локальное, данные не отправляются. Нельзя обещать восстановление после удаления browser storage: остаётся сохранённый session file. file:// storage может различаться между браузерами/путями, поэтому README описывает перенос через файл.

## 49. Export Strategy

PNG-карточка — опциональное расширение после основных критериев. DOWNLOAD PET CARD использует ту же composeScene и grammar. Сформировать самостоятельный SVG 1200px шириной, высота рассчитывается по 6–10 routine/3–6 hobbies; scene сверху, краткие факты ниже. Встроенные shapes и SVG text/tspan с ручным переносом строк; без HTML foreignObject, remote images или screenshot библиотеки. В документ включить все referenced symbols, ids с уникальным префиксом и цвета, чтобы SVG был самостоятельным.

SVG Blob → object URL → Image.decode/onload → Canvas → toBlob('image/png') → download. После завершения revokeObjectURL, обработка null blob и ошибок. Текст берётся из grammar и XML-экранируется; системный шрифт, длинные имена переносятся. Нельзя экспортировать только видимые 3 факта: карточка содержит все записи. Memory size ограничить 2× базового разрешения. При неудаче `We could not download the card. Try again.`; сессия остаётся доступной.

Session JSON резерв из §48 обязателен для защиты данных при ограничениях storage, независимо от решения о PNG. Экспорт никогда не публикует данные и не требует сервера.

## 50. Error Handling

| Ситуация | Реакция |
|---|---|
| Пустое/некорректное имя | inline message, переход с naming заблокирован |
| Не хватает routine/hobbies | `Choose at least 6 activities.` / `Choose at least 3 activities.` |
| Пропущены time/frequency | `Choose a time.` / `Choose how often.` возле записи |
| Неправильный ID в сохранении | отклонить snapshot, попробовать backup, предложить session file |
| Не найден SVG symbol | ошибка developer catalog validation; playable release запрещён |
| Сбой storage | сохранить в памяти, предложить SAVE SESSION FILE |
| Невалидный import | `This file is not a saved game.`; активная сессия не меняется |
| Нельзя compare | `Choose two different pets.` |
| Полный reset | confirmation; KEEP PLAYING по умолчанию |
| Unsaved edit cancel | `Discard your changes?` → KEEP EDITING / DISCARD |
| Fullscreen/export отказ | короткий статус, без reset и без блокировки остальных функций |

Любые ошибки parse/IO/async обрабатываются, не превращаются в uncaught exception. Технические детали разрешены в console для разработчика, ученик получает понятный английский текст. Ошибка сохранения не должна показывать ложный статус «сохранено после перезагрузки».

## 51. Implementation Order

Реализация начинается только после отдельной команды, не в рамках создания этой спецификации.

1. **SVG art system:** palette, proportions, viewBoxes, symbol registry, scene/anchors contract; один законченный cat для проверки системы, не placeholder.
2. **Animals:** остальные пять, 3 facial states, проверка всех neck/head комбинаций и ear occlusion.
3. **Rooms and items:** 24 room layers, 9 room details, 9 accessories, 5 bowls, 6 toys; единая composeScene, thumbnail reuse.
4. **Icons:** все 28 activity и 16 UI SVG; dev registry build проверяет 104 файла и уникальные ids.
5. **Base application:** local classic scripts, validation/state, storage recovery, accessible shell/setup/navigation. Заложить N-player модель сразу, хотя сначала проходить 1-player scenario.
6. **Pet creator:** naming/customisation/items/room, live preview, BACK/NEXT, edit drafts.
7. **Routine:** library, whole-hour picker, timeline, limits и explicit grammar.
8. **Advanced hobbies:** frequency, optional favourite, profile и prompt filtering.
9. **Multiplayer:** последовательный SAVE/NEXT, stable ids, gallery, редактирование без изменения очереди.
10. **Comparison and speaking:** объединение фактов, NOT SHOWN, оба числа глагола, presentation без монолога.
11. **Polish and validation:** responsive, keyboard, reduced motion, fullscreen, offline/file://, JSON backup, meaningful tests. PNG только после обязательных проверок, отдельной необязательной подзадачей.

Результат каждой фазы проверяется до следующей. Не откладывать модель хранения до конца и не пытаться заменить исходную графику внешними картинками.

## 52. Testing Checklist

### Logic tests будущей реализации

- Все 28 explicit mappings проверены на ожидаемую фразу; have→has, go→goes, brush→brushes its teeth, watch→watches; вопросы используют base, both pets — plural base.
- Время 6,12,13,19,22 отображается корректно; 7 и 19 различаются; никакие минуты не допускаются и не появляются в UI/PNG.
- Add/update/remove не создают duplicate activityId; limit 6–10 routine и 3–6 hobbies соблюдён; частота null не проходит SAVE, never проходит.
- SAVE двух/четырёх pets не меняет предыдущие объекты; double SAVE идемпотентен; edit копирует массивы; CANCEL сохраняет исходник; NEXT невозможен до SAVE.
- EDIT предыдущего pet при незавершённом следующем draft не теряет этот draft и очередь; duplicate names сохраняются с различными id.
- Compare: общая activity/одинаковое time, разное time, 7 vs 19, разные frequency, never vs never, never vs absent, разные toy/room, отсутствие same/different. Порядок массива не влияет на результаты.
- Favourite нельзя связать с never/невыбранным hobby; смена frequency и удаление корректно очищают favourite.
- Parse malformed JSON, unsupported schema, invalid ids, duplicate player numbers, overflow counts, invalid timestamps/navigation; primary failure с корректным backup; storage exceptions; import invalid не мутирует active session.

### Browser acceptance

- Все 8 сочетаний mode × player count проходят от START до presentation; все 6 возможных пар четырёх pets открываются, редактирование обновляет compare.
- Полный проход без сети по двойному клику index.html; никаких fetch/CDN/fonts/module ошибок. Также проверка через обычный static server как альтернативный запуск.
- Все 104 исходных SVG присутствуют, registry соответствует им; все 6 животных × 7 neck вариантов × 4 head вариантов (196 сочетаний) осмотрены на clipping/посадку. Room scenes проверены для всех тем и selectable предметов.
- Reload при naming/routine/hobby/review/edit/gallery восстанавливает last saved draft и готовых pets; privacy/storage-disabled сценарий объясняет ограничения и позволяет JSON round-trip.
- START AGAIN → KEEP PLAYING ничего не меняет; подтверждение очищает только игру. Import active session требует confirmation.
- Проверки размеров §44, 200% zoom, длинных имён; нет горизонтального overflow и перекрытия footer.
- Только keyboard: выбор, имя, часы, частоты, удаление, modal, SAVE, edit, compare, presentation; фокус не теряется при preview update.
- Screen reader labels, radio state, live message, descriptions часов; слова SAME/DIFFERENT/NOT SHOWN и частоты читаются без цвета.
- Reduced motion отключает движение; Fullscreen отказ/Esc не меняет session.
- Финальные scenes выглядят единообразно: не дошкольные, не stock icons, достаточно контраста и читаемые при screen sharing.
- Если включён PNG: все факты и длинное имя входят в файл; локальный запуск, несколько exports, ошибка decode/toBlob не теряет pet; object URLs освобождаются.

Тесты сосредоточены на грамматике, сохранности state, сравнениях и реальных сценариях, а не дублируют разметку компонентов. Ручной визуальный контроль необходим: наличие файла не доказывает художественную готовность.

## 53. Definition of Done

Текущий этап завершён, когда существует только подробная, согласованная спецификация с 53 обязательными разделами, точным asset inventory, схемами, правилами переходов, grammar и compare logic. После её создания агент останавливается.

Будущая игра считается готовой, когда:

- Все графические элементы самостоятельно созданы coding agent; пользователь не ищет, не рисует и не загружает assets. Нет placeholder graphics, stock images, emoji-графики или image-generation API.
- Все шесть животных, шесть комнат, предметы и 28 activity icons принадлежат единой art system; SVG pack соответствует точным 104 файлам.
- Игра запускается локально без интернета, backend, account или установки зависимостей; английский UI A1–A2 работает на laptop/board и меньших экранах.
- 1–4 ученика получают независимые pets; два режима работают; whole-hour time соблюдается; второй режим содержит hobbies + четыре frequency.
- Explicit grammar даёт корректные singular statements, base-form questions и plural starters; its используется корректно.
- Live preview, профиль, presentation без готового монолога, gallery, любые пары, SAME/DIFFERENT/NOT SHOWN работают. Невыбранные факты не интерпретируются как never.
- EDIT, CANCEL, NEXT, reload, storage failure, reset и JSON backup не теряют уже созданных pets без осознанного подтверждения удаления; ограничения браузерного хранения честно отражены.
- Критические logic/browser проверки §52 пройдены, keyboard/contrast/reduced motion поддержаны, fullscreen имеет fallback.
- Визуально это законченная мини-игра для 8–13 лет, а не worksheet, preschool illustration или human dress-up simulator.
- README объясняет запуск и сохранение. PNG, если реализован, проходит отдельные проверки; его отсутствие не блокирует обязательный релиз.

### Решённые неоднозначности и остаточные сложности

1. Утро/вечер: внутренние часы 6–22 и текст части дня устраняют неоднозначность одинакового 12-часового label; минуты не вводятся.
2. Pronoun: фиксированное it/its сохраняет учебный фокус без дополнительных he/she решений.
3. Same/different: добавлен NOT SHOWN, чтобы не приписывать питомцу невыбранное действие или частоту never.
4. Speaking: полный текст остаётся в profile как опора, presentation и compare дают визуальные prompts/starters, а не готовый ответ.
5. Offline: локальный JS art registry и classic scripts устраняют необходимость fetch SVG/ES modules при file://. Генератор используется только разработчиком.
6. Storage: возможности file:// и private mode зависят от браузера; память, честное предупреждение, backup и JSON session file уменьшают риск, но не гарантируют восстановление после удаления всех копий.
7. Art: самая трудоёмкая часть — качественные 104 SVG и посадка аксессуаров на rabbit/fox/red panda. Проверка всех сочетаний обязательна; качество нельзя заменить placeholders.
8. Classroom timing: четыре последовательных creator могут занять значительную часть урока. Defaults и необязательные room details сокращают дизайн; лимиты routine/hobbies удерживают языковую задачу в центре, автоматического таймера нет.

**Граница текущей работы: после сохранения и проверки TAMAGOTCHI_GAME_SPEC.md остановиться. Игру и её исходные assets сейчас не создавать.**

??????????: mini-pig ???????? ?? ??????? ????????????. ID `mini_pig`; ??? 7 ????????? neck (??????? none), 4 head ? 3 ????????? ???? ??????????????. ????? ?????? ???????? v1, ??????? ??????? ??????????.
