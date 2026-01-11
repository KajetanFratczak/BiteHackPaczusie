# Dokumentacja Projektu OtoBiznes

## 1. Wstęp
**OtoBiznes** to platforma internetowa łącząca lokalnych przedsiębiorców z klientami. Celem projektu jest stworzenie systemu ogłoszeniowego, który pozwala małym przedsiębiorcom na promowanie swoich usług, a użytkownikom na łatwe wyszukiwanie ofert i wystawianie opinii. Aplikacja umożliwia właścicielom lokalnych biznesów tworzenie profili biznesowych, publikowanie ogłoszeń oraz zbieranie recenzji. System oferuje również panel administratora do zarządzania treściami i użytkownikami.

### 🎯 Główne założenia i funkcjonalności:
* **Wielorolowość:** Obsługa trzech ról: Użytkownik (user): przeglądanie ofert i wystawianie recenzji, Przedsiębiorca (business_owner): zarządzanie profilami firm i ogłoszeniami oraz Administrator (admin): moderacja treści i zarządzanie użytkownikami.
* **Zarządzanie wizytówkami firm:** Lokalni przedsiębiorcy mogą tworzyć profile biznesowe zawierające dane kontaktowe i opis działalności.
* **System ogłoszeń (Ads):** Tworzenie ofert z ceną, lokalizacją i kategoriami.
* **Moderacja treści:** Nowe ogłoszenia trafiają do kolejki i wymagają zatwierdzenia przez Administratora (domyślnie nowe ogłoszenia są nieaktywne - status=False i wymagają zatwierdzenia przez administratora przed publikacją).
* **System recenzji:** Możliwość oceniania ogłoszeń (skala 1-5) wraz z komentarzem tekstowym.
* **Bezpieczeństwo:** Autoryzacja oparta na tokenach JWT oraz bezpieczne hashowanie haseł (Argon2).

---

## 2. Technologie (Tech Stack)

### Backend (Serwer)
* **Język**: Python 3.x
* **Framework**: FastAPI
* **Baza danych**: SQLite (z wykorzystaniem SQLModel / SQLAlchemy)
* **Autentykacja**: JWT (JSON Web Tokens), hashowanie haseł (Argon2)
* **Kluczowe biblioteki**: `uvicorn`, `pydantic`, `python-jose`, `passlib`, `multipart`

### Frontend (Klient)
* **Framework**: React.js
* **Styling**: Tailwind CSS
* **Routing**: React Router
* **Komunikacja z API**: Axios
* **Zarządzanie stanem**: React Context API (`AuthContext`)

---

## 3. Struktura Projektu

Projekt podzielony jest na katalog `backend` (logika serwerowa) oraz katalog z kodem źródłowym frontendu (`frontend/paczusie_frontend/src`).

```text
/
├── backend/                # --- Backend (FastAPI) ---
│   ├── database/           # Konfiguracja bazy danych
│   │   ├── database.py     # Sesja i silnik DB
│   │   └── models.py       # Modele tabel (User, Ad, BusinessProfile, Reviews, Categories, AdCategory)
│   ├── .env                # Zmienne środowiskowe (klucze, ustawienia)
│   ├── main.py             # Główny punkt wejścia aplikacji, endpointy
│   ├── schemas.py          # Schematy Pydantic (walidacja danych)
│   ├── security.py         # Logika tokenów JWT i hashowania haseł
│   └── requirements.txt    # Lista wymaganych bibliotek Python
│
├── src/                    # --- Frontend (React) ---
│   ├── assets/             # Obrazy i logotypy
│   ├── components/         # Komponenty (Navbar, AdCard, ReviewCard, itp.)
│   ├── context/            # AuthContext (stan logowania)
│   ├── pages/              # Widoki stron (HomePage, LoginPage, AdminPage, itp.)
│   ├── services/           # Funkcje API (authService, adService, userService)
│   └── App.js              # Główny routing aplikacji
└── 
```

---

## 4. Infrastruktura i Baza Danych
Aplikacja wykorzystuje bazę danych SQLite do trwałego przechowywania informacji. Całość została zaprojektowana w sposób lekki, niewymagający zewnętrznego serwera bazodanowego przy małej skali.

* **Integracja**: Backend (FastAPI) komunikuje się z bazą za pomocą biblioteki SQLModel, która łączy zalety SQLAlchemy (ORM) oraz Pydantic (walidacja).

* **Persystencja**: Dane są przechowywane w pliku database.db. Struktura tabel jest automatycznie tworzona przy starcie aplikacji dzięki funkcji create_db_and_tables().

---

## 5. Model obiektowy (encje)
### User
Reprezentuje użytkownika systemu.

**Pola:**
- `int` **user_id** (PK)
- `String` **first_name**
- `String` **last_name**
- `String` **email** (unikalny)
- `String` **hashed_password**
- `String` **role**
- `DateTime` **created_at**

**Relacje:**
- Jeden użytkownik może posiadać wiele profili firmowych  
  → relacja **1:N** z `BusinessProfile`

---

### BusinessProfile (Profil firmy)
Wizytówka firmy należącej do użytkownika.

**Pola:**
- `int` **bp_id** (PK)
- `int` **user_id** (FK → `User.user_id`)
- `String` **bp_name**
- `String` **description** (opcjonalne)
- `String` **address**
- `String` **phone**
- `DateTime` **created_at**

**Relacje:**
- Każdy profil firmy należy do jednego użytkownika  
  → relacja **N:1** z `User`
- Jeden profil firmy może mieć wiele ogłoszeń  
  → relacja **1:N** z `Ad`

---

### Ad (Ogłoszenie)
Główny element systemu – oferta/usługa publikowana przez firmę.

**Pola:**
- `int` **ad_id** (PK)
- `String` **ad_title**
- `int` **bp_id** (FK → `BusinessProfile.bp_id`)
- `String` **description** (opcjonalne)
- `List[String]` **images** (lista URL-i, przechowywana jako JSON)
- `String` **price**
- `String` **address**
- `String` **post_date**
- `String` **due_date**
- `boolean` **status**
- `DateTime` **created_at**

**Relacje:**
- Ogłoszenie należy do jednego profilu firmy  
  → relacja **N:1** z `BusinessProfile`
- Ogłoszenie może należeć do wielu kategorii  
  → relacja **M:N** z `Categories` (przez `AdCategory`)
- Ogłoszenie może posiadać wiele recenzji  
  → relacja **1:N** z `Reviews`

---

### Categories (Kategoria)
Słownik kategorii usług/ogłoszeń.

**Pola:**
- `int` **category_id** (PK)
- `String` **category_name**
- `DateTime` **created_at**

**Relacje:**
- Jedna kategoria może być przypisana do wielu ogłoszeń  
  → relacja **M:N** z `Ad` (przez `AdCategory`)

---

### AdCategory (Tabela łącznikowa)
Encja łącząca ogłoszenia z kategoriami (relacja wiele-do-wielu).

**Pola:**
- `int` **ad_id** (PK, FK → `Ad.ad_id`)
- `int` **category_id** (PK, FK → `Categories.category_id`)
- `DateTime` **created_at**

**Relacje:**
- relacja **N:1** do `Ad`
- relacja **N:1** do `Categories`

---

### Reviews (Recenzja)
Opinie dotyczące konkretnych ogłoszeń.

**Pola:**
- `int` **review_id** (PK)
- `int` **ad_id** (FK → `Ad.ad_id`)
- `String` **title**
- `String` **description**
- `float` **rating**

**Relacje:**
- Recenzja dotyczy jednego ogłoszenia  
  → relacja **N:1** z `Ad`

---
## 6. Bezpieczeństwo

* **Uwierzytelnianie**: System wykorzystuje tokeny **JWT (JSON Web Token)**. Po zalogowaniu token jest przesyłany w nagłówku `Authorization: Bearer <token>`.
* **Hashowanie Haseł**: Hasła nie są przechowywane w formie jawnej. Aplikacja wykorzystuje algorytm **Argon2** (za pośrednictwem biblioteki `passlib`).
---

## 7. Dokumentacja API (Endpointy)

### Użytkownicy
* `POST /register`: Rejestracja nowego użytkownika.

```json
{
  "email": "jan@kowalski.pl",
  "first_name": "jan",
  "last_name": "kowalski",
  "password": "jan"
}
```

**Zwraca**

```json
{
  "user_id": 7,
  "email": "jan@kowalski.pl"
}
```

* `GET /me`: Pobranie danych zalogowanego użytkownika.

* `POST /login`: Logowanie i generowanie tokena JWT.

```json
{
  "email": "jan@kowalski.pl",
  "password": "jan"
}
```

**Zwraca**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3IiwiZXhwIjoxNzY4MTE3NjkxfQ.-FqytFCtXw8L6HHoyYpAfbK_7sAXYxq9nr2pkq2Ag0I",
  "token_type": "bearer"
}
```

* `GET /users`: Lista wszystkich użytkowników (Tylko `admin`).
**Zwraca**

```json
[
  {
    "email": "matwoj8@gmail.com",
    "user_id": 1,
    "role": "admin",
    "last_name": "Wójcicki",
    "first_name": "Mateusz",
    "hashed_password": "$argon2id$v=19$m=65536,t=3,p=4$B4AQgnBOSQkh5BzjnNPamw$P8CDTNHdRpEbps/n+ZELUmla/qvX1lNASd7Z0qtMarM",
    "created_at": "2026-01-11T02:45:39.024544"
  },
  {
    "email": "picobello@onet.pl",
    "user_id": 2,
    "role": "business_owner",
    "last_name": "Balicki",
    "first_name": "Szymon",
    "hashed_password": "$argon2id$v=19$m=65536,t=3,p=4$5txba43R+p8Twvg/pzRmLA$CqgOIPh7s5lt6olxEyKA+zwIOIyf+h7GGdYrkBIUBIA",
    "created_at": "2026-01-11T02:46:23.456982"
  },
  {
    "email": "bestiaw@wow.pl",
    "user_id": 3,
    "role": "business_owner",
    "last_name": "Frątczak",
    "first_name": "Kajetan",
    "hashed_password": "$argon2id$v=19$m=65536,t=3,p=4$pDTm/P9f6937n9Pau7f2ng$HPEa2OCG7xpMO7Y96BLebcF0jLMhQ7H93llf/DThOlA",
    "created_at": "2026-01-11T02:46:34.613781"
  },
  {
    "email": "merlin@gmail.com",
    "user_id": 4,
    "role": "business_owner",
    "last_name": "Szymański",
    "first_name": "Konrad",
    "hashed_password": "$argon2id$v=19$m=65536,t=3,p=4$9N7bm9N6L8UYw9h7j/HeGw$tLN4g7wO3XqFlzasGq+VjfrR3i8sEv7IEFJ+XC285EE",
    "created_at": "2026-01-11T02:46:44.967716"
  },
  {
    "email": "franio@gmail.com",
    "user_id": 5,
    "role": "business_owner",
    "last_name": "Jawor",
    "first_name": "Franciszek",
    "hashed_password": "$argon2id$v=19$m=65536,t=3,p=4$nJPy/h/DWOtdi9Eag1DK2Q$HC9H4DT0LDfsduegP8CI5tsoXZDg6bVcL43x1cvYI5s",
    "created_at": "2026-01-11T02:46:55.120389"
  },
  {
    "email": "ryszard@gmail.com",
    "user_id": 6,
    "role": "business_owner",
    "last_name": "Ryś",
    "first_name": "Mateusz",
    "hashed_password": "$argon2id$v=19$m=65536,t=3,p=4$5XxvLeUcg7BWSqmV8h6jlA$pGs7JmdqroONVFefEmsCv7oM/JwLE2R62PJMAIAt4KM",
    "created_at": "2026-01-11T02:47:03.683422"
  },
  {
    "email": "jan@kowalski.pl",
    "user_id": 7,
    "role": "business_owner",
    "last_name": "kowalski",
    "first_name": "jan",
    "hashed_password": "$argon2id$v=19$m=65536,t=3,p=4$kHJurRVCKGXsndN6LwWA0A$Iyh9IAvmqrDneTjCXP+WRLjFWtlWrIOpwYvqI3IwFlU",
    "created_at": "2026-01-11T06:44:08.524541"
  }
]
```

* `POST /users`: Dodawanie nowego użytkownika.

```json
{
  "user_id": 8,
  "first_name": "bob",
  "last_name": "bob",
  "email": "bob@bob.pl",
  "hashed_password": "$argon2id$v=19$m=65536,t=3,p=4$kHJurRVCKGXsndN6LwWA0A$Iyh9IAvmqrDneTjCXP+WRLjFWtlWrIOpwYvqI3IwFlU",
  "role": "admin"
}
```

**Zwraca**

```json
{
  "email": "bob@bob.pl",
  "user_id": 8,
  "role": "admin",
  "last_name": "bob",
  "first_name": "bob",
  "hashed_password": "$argon2id$v=19$m=65536,t=3,p=4$S2mttbY2RmgN4TynVGqNkQ$WaS0mJf2AFWETkIhjsEH7bj1RXxC0g4f9oMjruCXQRA",
  "created_at": "2026-01-11T06:50:27.990646"
}
```

* `GET /users/{user_id}`: Pobranie użytkownika.
```json
{
  "user_id": 7,
}
```

**Zwraca**

```json
{
  "email": "jan@kowalski.pl",
  "user_id": 7,
  "role": "business_owner",
  "last_name": "kowalski",
  "first_name": "jan",
  "hashed_password": "$argon2id$v=19$m=65536,t=3,p=4$kHJurRVCKGXsndN6LwWA0A$Iyh9IAvmqrDneTjCXP+WRLjFWtlWrIOpwYvqI3IwFlU",
  "created_at": "2026-01-11T06:44:08.524541"
}
```

* `PUT /users/{user_id}`: Edytowanie użytkownika.
```json
{
  "user_id": 7,
  "first_name": "john",
  "last_name": "john",
  "email": "john@john.pl",
  "hashed_password": "$argon2id$v=19$m=65536,t=3,p=4$S2mttbY2RmgN4TynVGqNkQ$WaS0mJf2AFWETkIhjsEH7bj1RXxC0g4f9oMjruCXQRA",
  "role": "user"
}
```

**Zwraca**

```json
{
  "email": "john@john.pl",
  "user_id": 7,
  "role": "user",
  "last_name": "john",
  "first_name": "john",
  "hashed_password": "$argon2id$v=19$m=65536,t=3,p=4$S2mttbY2RmgN4TynVGqNkQ$WaS0mJf2AFWETkIhjsEH7bj1RXxC0g4f9oMjruCXQRA",
  "created_at": "2026-01-11T06:44:08.524541"
}
```



* `DELETE /users/{user_id}`: Usunięcie użytkownika.
```json
{
  "user_id": 8
}
```

**Zwraca**

```json
{
  "message": "Użytkownik usunięty pomyślnie"
}
```

### Biznesy
* `GET /businesses/user/{user_id}`:
```json
{
  "user_id": 4
}
```

**Zwraca**

```json
[
  {
    "bp_name": "Royal Games Casino",
    "user_id": 4,
    "address": "ul. Floriańska 25, 31-020 Kraków",
    "created_at": "2026-01-11T02:47:52.077484",
    "bp_id": 3,
    "description": "Ekskluzywne kasyno w centrum Krakowa oferujące automaty, gry stołowe oraz turnieje pokerowe. Przyjazna atmosfera, możliwość organizacji eventów firmowych i prywatnych. Obsługa w języku polskim i angielskim.",
    "phone": "+48 512 987 321"
  },
  {
    "bp_name": "Kawiarnia i Bistro Smak Krakowa",
    "user_id": 4,
    "address": "ul. Dietla 48, 31-039 Kraków",
    "created_at": "2026-01-11T02:47:59.802567",
    "bp_id": 4,
    "description": "Lokalna kawiarnia i bistro w sercu Krakowa oferująca świeżo parzoną kawę, wypieki domowe oraz dania lunchowe. Możliwość zamówień na wynos i catering dla firm.",
    "phone": "+48 601 234 567"
  }
]
```

* `GET /businesses`:

**Zwraca**

```json
[
  {
    "bp_name": "Gospodarstwo Rolne Zielone Kartoflisko",
    "user_id": 2,
    "address": "ul. Tyniecka 180, 30-376 Kraków",
    "created_at": "2026-01-11T02:47:33.895801",
    "bp_id": 1,
    "description": "Rodzinne gospodarstwo rolne specjalizujące się w uprawie ziemniaków jadalnych oraz sadzeniaków. Oferujemy świeże, sezonowe warzywa prosto z pola, możliwość zamówień hurtowych oraz dostawy na terenie Krakowa i okolic. Stawiamy na naturalne metody uprawy i wysoką jakość plonów.",
    "phone": "+48 512 948 327"
  },
  {
    "bp_name": "KrakFit Studio Treningu Personalnego",
    "user_id": 3,
    "address": "ul. Kalwaryjska 33, 30-504 Kraków",
    "created_at": "2026-01-11T02:47:43.444785",
    "bp_id": 2,
    "description": "Profesjonalne studio treningu personalnego i przygotowania motorycznego. Pomagamy w redukcji wagi, budowaniu masy mięśniowej oraz poprawie kondycji. Oferujemy indywidualne plany treningowe, konsultacje dietetyczne oraz zajęcia dla początkujących i zaawansowanych.",
    "phone": "+48 698 245 173"
  },
  {
    "bp_name": "Royal Games Casino",
    "user_id": 4,
    "address": "ul. Floriańska 25, 31-020 Kraków",
    "created_at": "2026-01-11T02:47:52.077484",
    "bp_id": 3,
    "description": "Ekskluzywne kasyno w centrum Krakowa oferujące automaty, gry stołowe oraz turnieje pokerowe. Przyjazna atmosfera, możliwość organizacji eventów firmowych i prywatnych. Obsługa w języku polskim i angielskim.",
    "phone": "+48 512 987 321"
  },
  {
    "bp_name": "Kawiarnia i Bistro Smak Krakowa",
    "user_id": 4,
    "address": "ul. Dietla 48, 31-039 Kraków",
    "created_at": "2026-01-11T02:47:59.802567",
    "bp_id": 4,
    "description": "Lokalna kawiarnia i bistro w sercu Krakowa oferująca świeżo parzoną kawę, wypieki domowe oraz dania lunchowe. Możliwość zamówień na wynos i catering dla firm.",
    "phone": "+48 601 234 567"
  }
]
```

* `POST /businesses`:
```json
{
  "bp_id": 5,
  "user_id": 5,
  "bp_name": "biznes",
  "description": "string",
  "address": "string",
  "phone": "999-999-999"
}
```

**Zwraca**

```json
{
  "bp_name": "biznes",
  "user_id": 5,
  "address": "string",
  "created_at": "2026-01-11T07:01:38.539469",
  "bp_id": 5,
  "description": "string",
  "phone": "999-999-999"
}
```

* `GET /businesses/{bp_id}`:
```json
{
  "bp_id": 5
}
```

**Zwraca**

```json
{
  "bp_name": "biznes",
  "user_id": 5,
  "address": "string",
  "created_at": "2026-01-11T07:01:38.539469",
  "bp_id": 5,
  "description": "string",
  "phone": "999-999-999"
}
```

* `PUT /businesses/{bp_id}`:
```json
{
  "bp_id": 5,
  "user_id": 5,
  "bp_name": "string",
  "description": "string",
  "address": "string",
  "phone": "111-111-111"
}
```

**Zwraca**

```json
{
  "bp_name": "string",
  "user_id": 5,
  "address": "string",
  "created_at": "2026-01-11T07:02:55.674464",
  "bp_id": 5,
  "description": "string",
  "phone": "111-111-111"
}
```

* `DELETE /businesses/{bp_id}`:
```json
{
  "bp_id": 5
}
```

**Zwraca**

```json

```

* `GET /businesses/{bp_id}/ads`:
```json
{
  "bp_id": 2
}
```

**Zwraca**

```json
[
  {
    "ad_title": "Trening personalny 1:1 w KrakFit Studio",
    "description": "Oferuję indywidualne treningi personalne dopasowane do Twojego celu – redukcja tkanki tłuszczowej, poprawa sylwetki, zwiększenie siły lub przygotowanie motoryczne. Pierwsza konsultacja gratis.",
    "price": "120 zł/h",
    "post_date": "2026-01-10",
    "status": true,
    "ad_id": 4,
    "bp_id": 2,
    "images": [
      "https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg",
      "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg",
      "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg"
    ],
    "address": "ul. Kalwaryjska 33, 30-504 Kraków",
    "due_date": "2026-02-28",
    "created_at": "2026-01-11T02:49:17.614049"
  },
  {
    "ad_title": "Indywidualny plan treningowy i dietetyczny",
    "description": "Układam spersonalizowane plany treningowe oraz jadłospisy dostosowane do Twojego celu i stanu zdrowia. Stała opieka trenerska online i cotygodniowa analiza postępów.",
    "price": "120 zł/h + 100 zł za plan",
    "post_date": "2026-01-09",
    "status": true,
    "ad_id": 5,
    "bp_id": 2,
    "images": [
      "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg",
      "https://images.pexels.com/photos/406152/pexels-photo-406152.jpeg"
    ],
    "address": "ul. Kalwaryjska 33, 30-504 Kraków",
    "due_date": "2026-02-20",
    "created_at": "2026-01-11T02:49:25.577294"
  },
  {
    "ad_title": "Zajęcia ogólnorozwojowe dla młodzieży 12–17 lat",
    "description": "Prowadzę treningi ogólnorozwojowe dla młodzieży poprawiające koordynację, siłę i wytrzymałość. Idealne jako uzupełnienie sportów szkolnych. Małe grupy, bezpieczne ćwiczenia.",
    "price": "90 zł/h",
    "post_date": "2026-01-11",
    "status": true,
    "ad_id": 6,
    "bp_id": 2,
    "images": [
      "https://media.istockphoto.com/id/1188433175/pl/zdj%C4%99cie/szcz%C4%99%C5%9Bliwy-ojciec-patrzy-na-weso%C5%82ego-syna-i-%C4%87wiczy-z-hantlami.webp?s=1024x1024&w=is&k=20&c=wNJ7e4rzJOmhy55xglu-3p3PBYmdC0sKVNr9nYyk0qk=",
      "https://media.istockphoto.com/id/1628976306/pl/zdj%C4%99cie/szcz%C4%99%C5%9Bliwa-dziewczyna-rozci%C4%85ga-swoje-cia%C5%82o-na-fitball-na-si%C5%82owni.webp?s=1024x1024&w=is&k=20&c=quNKBNlb709j26iik-T8pIHhJRIKXhl4uzwWWG5ECAA="
    ],
    "address": "ul. Kalwaryjska 33, 30-504 Kraków",
    "due_date": "2026-03-15",
    "created_at": "2026-01-11T02:49:31.957312"
  }
]
```

### Ogłoszenia
* `POST /ads`:
```json
{
  "ad_title": "Naprawa laptopów i komputerów",
  "bp_id": 1,
  "description": "Profesjonalny serwis sprzętu komputerowego.",
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "price": "od 100 PLN",
  "address": "ul. Techniczna 5, Kraków",
  "post_date": "2024-05-20",
  "due_date": "2024-06-20"
}
```

**Zwraca**

```json
{
  "ad_title": "Naprawa laptopów i komputerów",
  "description": "Profesjonalny serwis sprzętu komputerowego.",
  "price": "od 100 PLN",
  "post_date": "2024-05-20",
  "status": false,
  "ad_id": 12,
  "bp_id": 1,
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "address": "ul. Techniczna 5, Kraków",
  "due_date": "2024-06-20",
  "created_at": "2026-01-11T07:07:13.401168"
}
```

* `GET /ads`:

**Zwraca**

```json
[
  {
    "ad_title": "Sprzedaż świeżych ziemniaków jadalnych prosto z gospodarstwa",
    "description": "Oferuję ziemniaki jadalne tegoroczne, odmiana Irga i Denar. Idealne do gotowania i pieczenia. Możliwość zakupu hurtowego oraz detalicznego. Zbiór bezpośrednio z pola, bardzo dobra jakość. Możliwy dowóz na terenie Krakowa i okolic. Cena ziemniaków za kilo",
    "price": "3 zł/kg",
    "post_date": "2026-01-05",
    "status": true,
    "ad_id": 1,
    "bp_id": 1,
    "images": [
      "https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg",
      "https://images.pexels.com/photos/31908568/pexels-photo-31908568.jpeg"
    ],
    "address": "ul. Tyniecka 180, 30-376 Kraków",
    "due_date": "2026-02-05",
    "created_at": "2026-01-11T02:48:31.900010"
  },
  {
    "ad_title": "Warzywa prosto z pola – ziemniaki, marchew, buraki",
    "description": "Sprzedam świeże warzywa z ekologicznych upraw: marchew, buraki ćwikłowe. Zbiory z gospodarstwa rodzinnego. Możliwość wystawienia faktury oraz dowozu przy większych zamówieniach.",
    "price": "5 zł/kg (buraki), 3 zł/kg (marchew)",
    "post_date": "2026-01-10",
    "status": true,
    "ad_id": 2,
    "bp_id": 1,
    "images": [
      "https://images.pexels.com/photos/73640/pexels-photo-73640.jpeg",
      "https://images.pexels.com/photos/14564807/pexels-photo-14564807.jpeg",
      "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg"
    ],
    "address": "ul. Wielicka 250, 30-663 Kraków",
    "due_date": "2026-02-26",
    "created_at": "2026-01-11T02:48:47.901839"
  }
  ...
]
```

* `GET /ads/user/{user_id}`:
```json
{
  "user_id": 5
}
```

**Zwraca**

```json
[
  {
    "ad_title": "Rozpocznij naukę języka z LinguaPro!",
    "description": "Zapisz się na kurs języka angielskiego, niemieckiego, francuskiego lub hiszpańskiego. Oferujemy zajęcia dla dzieci, młodzieży i dorosłych. Nauka w małych grupach i profesjonalna kadra nauczycielska. Pierwsza lekcja próbna gratis!",
    "price": "1300 zł za kurs",
    "post_date": "2026-01-10",
    "status": true,
    "ad_id": 10,
    "bp_id": 5,
    "images": [
      "https://images.pexels.com/photos/8419515/pexels-photo-8419515.jpeg",
      "https://images.pexels.com/photos/8199626/pexels-photo-8199626.jpeg",
      "https://images.pexels.com/photos/29242209/pexels-photo-29242209.jpeg"
    ],
    "address": "ul. Długa 12, 31-146 Kraków",
    "due_date": "2026-03-31",
    "created_at": "2026-01-11T02:52:21.680208"
  },
  {
    "ad_title": "Zajęcia językowe online – ucz się z domu!",
    "description": "Nie masz czasu przychodzić do szkoły? Oferujemy kursy online dopasowane do Twojego poziomu i grafiku. Lekcje prowadzone przez doświadczonych nauczycieli na żywo, interaktywne ćwiczenia i materiały multimedialne.",
    "price": "60 zł/h",
    "post_date": "2026-01-12",
    "status": true,
    "ad_id": 11,
    "bp_id": 5,
    "images": [
      "https://images.pexels.com/photos/2422286/pexels-photo-2422286.jpeg",
      "https://images.pexels.com/photos/27177920/pexels-photo-27177920.jpeg"
    ],
    "address": "ul. Długa 12, 31-146 Kraków",
    "due_date": "2026-06-30",
    "created_at": "2026-01-11T02:52:38.061379"
  }
]
```

* `GET /ads/{ad_id}`:
```json
{
  "ad_id": 1
}
```

**Zwraca**

```json
{
  "ad_title": "Sprzedaż świeżych ziemniaków jadalnych prosto z gospodarstwa",
  "description": "Oferuję ziemniaki jadalne tegoroczne, odmiana Irga i Denar. Idealne do gotowania i pieczenia. Możliwość zakupu hurtowego oraz detalicznego. Zbiór bezpośrednio z pola, bardzo dobra jakość. Możliwy dowóz na terenie Krakowa i okolic. Cena ziemniaków za kilo",
  "price": "3 zł/kg",
  "post_date": "2026-01-05",
  "status": true,
  "ad_id": 1,
  "bp_id": 1,
  "images": [
    "https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg",
    "https://images.pexels.com/photos/31908568/pexels-photo-31908568.jpeg"
  ],
  "address": "ul. Tyniecka 180, 30-376 Kraków",
  "due_date": "2026-02-05",
  "created_at": "2026-01-11T02:48:31.900010"
}
```

* `PUT /ads/{ad_id}`:
```json
{
  "ad_id": 1,
  "ad_title": "string",
  "bp_id": 0,
  "description": "string",
  "images": [
    "string"
  ],
  "price": "string",
  "address": "string",
  "post_date": "string",
  "due_date": "string",
  "status": true
}
```

**Zwraca**

```json
{
  "ad_title": "string",
  "description": "string",
  "price": "string",
  "post_date": "string",
  "status": true,
  "ad_id": 1,
  "bp_id": 0,
  "images": [
    "string"
  ],
  "address": "string",
  "due_date": "string",
  "created_at": "2026-01-11T02:48:31.900010"
}
```

* `DELETE /ads/{ad_id}`:
```json
{
  "ad_id": 5
}
```

**Zwraca**

```json

```

* `GET /ads/status/{status}`:
```json
{
  "status": false
}
```

**Zwraca**

```json
[
  {
    "ad_title": "Naprawa laptopów i komputerów",
    "description": "Profesjonalny serwis sprzętu komputerowego.",
    "price": "od 100 PLN",
    "post_date": "2024-05-20",
    "status": false,
    "ad_id": 12,
    "bp_id": 1,
    "images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ],
    "address": "ul. Techniczna 5, Kraków",
    "due_date": "2024-06-20",
    "created_at": "2026-01-11T07:07:13.401168"
  }
]
```

* `PATCH /ads/{ad_id}/approve`:
```json
{
  "ad_id": 12
}
```

**Zwraca**

```json
{
  "ad_title": "Naprawa laptopów i komputerów",
  "description": "Profesjonalny serwis sprzętu komputerowego.",
  "price": "od 100 PLN",
  "post_date": "2024-05-20",
  "status": true,
  "ad_id": 12,
  "bp_id": 1,
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "address": "ul. Techniczna 5, Kraków",
  "due_date": "2024-06-20",
  "created_at": "2026-01-11T07:07:13.401168"
}
```

### Kategorie
* `GET /categories`:

**Zwraca**

```json
[
  {
    "category_name": "Rolnictwo",
    "created_at": "2026-01-11T02:55:05.957688",
    "category_id": 1
  },
  {
    "category_name": "Żywność i gastronomia",
    "created_at": "2026-01-11T02:55:21.650153",
    "category_id": 2
  },
  {
    "category_name": "Fitness i sport",
    "created_at": "2026-01-11T02:55:34.280311",
    "category_id": 3
  },
  ...
]
```

* `POST /categories`:

```json
{
  "category_name": "nowa"
}
```

**Zwraca**

```json
{
  "category_name": "nowa",
  "created_at": "2026-01-11T07:15:46.723626",
  "category_id": 12
}
```

* `GET /categories/{category_id}`:

```json
{
  "category_id": 2
}
```

**Zwraca**

```json
{
  "category_name": "Żywność i gastronomia",
  "created_at": "2026-01-11T02:55:21.650153",
  "category_id": 2
}
```

* `PUT /categories/{category_id}`:

```json
{
  "category_id": 2,
  "category_name": "string"
}
```

**Zwraca**

```json
{
  "category_name": "string",
  "created_at": "2026-01-11T07:17:33.950286",
  "category_id": 2
}
```

* `DELETE /categories/{category_id}`:

```json
{
  "category_id": 2
}
```

**Zwraca**

```json

```

### Ogłoszenia/Kategorie


### Opinie (reviews)

---

## 8. Logika Biznesowa

### Proces Moderacji
1. Przedsiębiorca dodaje ogłoszenie przez formularz.
2. Ogłoszenie trafia do bazy z polem `status = False`.
3. Ogłoszenie **nie jest widoczne** na stronie głównej.
4. Administrator w panelu `/admin` widzi listę "Pending Ads".
5. Po kliknięciu "Approve", status zmienia się na `True`, a ogłoszenie staje się publiczne.

### System Ocen
* Każdy zalogowany użytkownik może wystawić jedną recenzję pod ogłoszeniem.
* Średnia ocen jest obliczana dynamicznie i wyświetlana przy ogłoszeniu.

---

## 9. Frontend - Szczegóły Techniczne

### Zarządzanie Stanem (`AuthContext`)
Globalny kontekst przechowuje dane o zalogowanym użytkowniku oraz token. Dzięki temu informacja o uprawnieniach (np. czy pokazać przycisk "Dodaj ogłoszenie") jest dostępna w każdym komponencie.

### Komunikacja z API (`services`)
Logika zapytań jest odizolowana od komponentów UI:
* `adService.js`: Obsługa ogłoszeń i ich statusów.
* `authService.js`: Obsługa logowania i rejestracji.
* `api.js`: Konfiguracja Axios z interceptorem, który automatycznie dodaje token JWT do każdego zapytania.

---

## 10. Instrukcja Uruchomienia

### Backend
1. Wejdź do katalogu `backend`.
2. Zainstaluj zależności: `pip install -r requirements.txt`.
3. Skonfiguruj plik `.env` (klucz SECRET_KEY).
4. Uruchom serwer: `python main.py`.

### Frontend
1. Wejdź do głównego katalogu (gdzie znajduje się `package.json`).
2. Zainstaluj pakiety: `npm install`.
3. Uruchom aplikację: `npm start`.