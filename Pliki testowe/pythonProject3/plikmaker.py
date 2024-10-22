# Ustal zakres numerów i krok
start = 15
end = 35
step = 5

# Iteruj przez numery od start do end
for i in range(start, end + 1, step):
    filename = f"Polska-{i}.txt"

    # Generuj numery co 5
    numbers = list(range(0, 101, step))  # Zmodyfikuj 101 na inny górny limit, jeśli chcesz
    with open(filename, 'w') as file:
        for number in numbers:
            file.write(f"{number}\n")

    print(f"Utworzono plik: {filename}")

