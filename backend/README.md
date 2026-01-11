# 🏢 OtoBiznes - Platforma Ogłoszeń Lokalnych

**OtoBiznes** to nowoczesna platforma internetowa łącząca lokalnych przedsiębiorców z klientami. Aplikacja umożliwia małym firmom budowanie cyfrowej obecności poprzez profile biznesowe i ogłoszenia, a użytkownikom ułatwia odnalezienie sprawdzonych usług w ich okolicy.

---

## 🚀 Kluczowe Funkcjonalności

* **System Ogłoszeń:** Tworzenie ofert z opisem, cennikiem, lokalizacją oraz galerią zdjęć.
* **Wielorolowość:**
    * 👤 **Użytkownik:** Przeglanie ofert, filtrowanie po kategoriach i wystawianie recenzji.
    * 💼 **Przedsiębiorca:** Zarządzanie wizytówkami firm oraz publikowanie ogłoszeń.
    * 🛡️ **Administrator:** Moderacja treści (zatwierdzanie ogłoszeń) oraz zarządzanie bazą użytkowników.
* **Bezpieczeństwo:** Pełna autoryzacja oparta na tokenach **JWT** oraz bezpieczne hashowanie haseł algorytmem **Argon2**.
* **Moderacja:** Nowe ogłoszenia domyślnie mają status `False` i wymagają weryfikacji przez administratora przed publikacją.
* **System Opinii:** Dynamiczne obliczanie średniej ocen i moduł recenzji dla każdego ogłoszenia.

---

## 🛠️ Stack Technologiczny

### Backend
* **Język:** Python 3.x
* **Framework:** **FastAPI**
* **Baza danych:** SQLite z wykorzystaniem **SQLModel**
* **Autentykacja:** JWT (JSON Web Tokens), Passlib (Argon2)

### Frontend
* **Biblioteka:** **React.js**
* **Stylizacja:** **Tailwind CSS**
* **Zarządzanie stanem:** React Context API (`AuthContext`)
* **Komunikacja:** Axios

---

## 📂 Struktura Projektu

Aplikacja jest podzielona na dwie główne części:
* `backend/` – serwer API, logika biznesowa, modele bazy danych i zabezpieczenia.
* `src/` – kod źródłowy frontendu (React), komponenty UI i usługi komunikacji z API.

---

## ⚙️ Szybki Start

### Backend
1. Przejdź do folderu `backend`.
2. Zainstaluj zależności: `pip install -r requirements.txt`.
3. Skonfiguruj plik `.env` (klucz `SECRET_KEY`).
4. Uruchom serwer: `python main.py`.

### Frontend
1. Zainstaluj pakiety: `npm install`.
2. Uruchom aplikację: `npm start`.

---

## 👥 Autorzy
Projekt został stworzony na hackathon BiteHack 10/11 stycznia 2026 r. przez zespół w składzie:
* **Konrad Szymański**
* **Mateusz Wójcicki**
* **Kajetan Frątczak**
* **Szymon Balicki**