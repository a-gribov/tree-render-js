// Обработчик события клика по кнопке "Отрисовать"
document.getElementById('renderButton').addEventListener('click', () => {
  const input = document.getElementById('treeInput').value.trim()

  try {
    const tree = parseTree(input) // Парсим ввод в структуру дерева
    const output = renderTree(tree) // Генерируем текстовую визуализацию дерева
    document.getElementById('output').textContent = output
  } catch (error) {
    document.getElementById('output').textContent = 'Ошибка: ' + error.message
  }
})

/**
 * Парсит строку и преобразует её в объектное представление дерева.
 *
 * @param {string} input - Входная строка с определением дерева
 * @returns {Object} - Дерево в виде вложенных объектов
 * @throws {Error} - В случае некорректного ввода
 */
function parseTree(input) {
  const tokens = input.match(/\(|\)|\d+/g) // Разбиваем строку на токены (числа и скобки)
  if (!tokens) throw new Error('Некорректный ввод')

  let index = 0

  // Рекурсивная функция для построения дерева
  function buildTree() {
    if (index >= tokens.length) return null

    const token = tokens[index++]

    if (token === '(') {
      if (index >= tokens.length || tokens[index] === ')') {
        throw new Error('Пустой узел запрещен')
      }

      // Создаём узел дерева
      const node = {
        value: parseInt(tokens[index++], 10),
        children: [],
      }

      // Добавляем дочерние элементы, пока не встретим закрывающую скобку
      while (tokens[index] !== ')' && index < tokens.length) {
        node.children.push(buildTree())
      }

      if (tokens[index] === ')') index++ // Пропускаем закрывающую скобку

      return node
    } else if (!isNaN(token)) {
      // Одиночный узел без детей
      return { value: parseInt(token, 10), children: [] }
    }

    throw new Error('Ошибка парсинга структуры дерева')
  }

  const tree = buildTree()

  // Проверяем, что не осталось лишних токенов
  if (index !== tokens.length) throw new Error('Лишние символы в вводе')

  return tree
}

/**
 * Генерирует текстовую псевдографику дерева.
 *
 * @param {Object} node - Узел дерева
 * @param {string} prefix - Префикс для оформления уровней дерева
 * @param {boolean} isLast - Флаг последнего элемента на уровне
 * @returns {string} - Форматированное текстовое представление дерева
 */
function renderTree(node, prefix = '', isLast = true) {
  let output = `${prefix}${prefix ? (isLast ? '└── ' : '├── ') : ''}${
    node.value
  }\n`

  // Обходим всех потомков узла и рекурсивно строим строку
  node.children.forEach((child, index) => {
    const isLastChild = index === node.children.length - 1
    output += renderTree(
      child,
      prefix + (isLast ? '    ' : '│   '),
      isLastChild
    )
  })

  return output
}
