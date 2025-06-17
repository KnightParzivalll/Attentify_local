# Attentify

Этот проект разворачивается в Docker-окружении с использованием Docker Compose.
Ниже — пошаговая инструкция для локального запуска приложения.

---

## 📦 Требования

* **Docker**
* **Docker Compose**
* Готовый файл **.env** уже находится в репозитории

---

## 🚀 Как запустить проект локально

### 1️⃣ Перейти в папку проекта

```bash
cd ./Attentify_local
```

---

### 2️⃣ Собрать и запустить контейнеры

```bash
docker compose up -d --build
```

---

### 3️⃣ Проверить статус контейнеров

```bash
docker compose ps
```

Убедись, что все контейнеры в статусе `Up` и `healthy`.

---

### 4️⃣ Очистить базу данных

```bash
docker compose run --rm backend python -m scripts.clear
```

---

### 5️⃣ Применить миграции

```bash
docker compose run --rm backend alembic upgrade head
```

---

### 6️⃣ Засеять тестовые данные

```bash
docker compose run --rm backend python -m scripts.fill_3
```

---

### 7️⃣ Проверить работу приложения

Открыть в браузере:

```
http://localhost/
```

---

## 🧪 Тестовые данные для входа

После выполнения шага 5, в системе будут доступны следующие тестовые пользователи:

- **Учитель:**  
  `teacher1@example.com` / `teacherpassword`

- **Студенты:**  
  `student1@example.com` / `studentpassword`  
  `student2@example.com` / `studentpassword`  
  `student3@example.com` / `studentpassword`

---

## 🎉 Готово!

Приложение локально запущено и готово к работе.

---
