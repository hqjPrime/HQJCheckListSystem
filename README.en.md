# HQJ Check-List System

A feature-rich web to-do list management tool supporting category management, intelligent category suggestions, data statistics, import/export, and more.

## ✨ Features

### 📋 Core Features
- **To-Do Item Management**: Add, delete, and mark as completed
- **Category System**: Supports custom categories and intelligent category suggestions
- **Intelligent Learning**: Automatically learns category rules based on keywords
- **Category Filtering**: Filter to-do items by category
- **Statistics Panel**: Real-time display of completion rate statistics
- **Time Display**: Millisecond-precision time display
- **Import/Export**: Supports import and export in Markdown format

### 🎨 UI Features
- **Responsive Design**: Adapts to various screen sizes
- **Smooth Animations**: Wave animations, flowing bar animations, pulse effects
- **Visual Feedback**: Visual indicators for completion status, checkmark effects, etc.
- **Category Suggestions**: Intelligent prompts for recommended categories

## 🚀 Quick Start

### Requirements
- Modern browser (Chrome, Firefox, Edge, Safari, etc.)
- No server required — purely client-side application

### Usage
1. Open the `index.html` file directly in your browser
2. Or run the project using a local server (e.g., VS Code Live Server)

## 📖 User Guide

### Adding a To-Do Item
1. Enter the to-do item content in the input field
2. The system automatically suggests a category (based on keyword learning)
3. Click the suggested category or use the default category
4. Press Enter or click the "Add" button to complete addition

### Managing To-Do Items
- **Mark as Completed**: Click the checkbox
- **Delete Item**: Click the delete button
- **Filter by Category**: Click the category filter button at the top

### Intelligent Categorization
- The system automatically learns and suggests categories based on keywords
- On first use, the system loads predefined keyword mappings from `keywords.json`
- Newly added items are automatically associated with their corresponding categories

### Data Management
- **Export Data**: Click the export button to generate a Markdown file
- **Import Data**: Click the import button and select a Markdown file to import
- **Clear Data**: Click the clear button to remove all to-do items

## 📁 File Structure

```
hqj-check-list-system/
├── index.html      # Main page structure
├── script.js       # Core logic and interactions
├── style.css       # Styles and animations
├── keywords.json   # Keyword-to-category mappings
└── README.md       # Project documentation
```

## 🔧 Technical Implementation

### Core Modules
- **State Management**: Uses global variables to manage to-do items, categories, and filtering state
- **Local Storage**: Persistent data storage using localStorage
- **Keyword Learning**: Dynamically learns and updates keyword-to-category mappings
- **Rendering Engine**: Efficient rendering of lists and statistics panels
- **Animation System**: CSS animations for wave, flow, and pulse effects

### Dependencies
- No external libraries
- Pure native JavaScript + CSS implementation
- Uses HTML5 localStorage for data persistence

## 🎯 Core Function Descriptions

| Function Name | Description |
|---------------|-------------|
| `init()` | Initializes the application and loads data |
| `addItem()` | Adds a new to-do item |
| `toggleDone()` | Toggles the completion status of a to-do item |
| `deleteItem()` | Deletes a to-do item |
| `filterByCategory()` | Filters to-do items by category |
| `learnCategory()` | Learns and records keyword-to-category mappings |
| `getSuggestedCategory()` | Retrieves intelligent category suggestions |
| `exportToMarkdown()` | Exports data in Markdown format |
| `importFromMarkdown()` | Imports data from a Markdown file |

## 📊 UI Layout

```
┌─────────────────────────────────────────┐
│              Title Bar                  │
├──────────────┬──────────────────────────┤
│              │     📊 Statistics Panel  │
│              │  ┌──────────────────┐    │
│   📝 To-Do   │  │   Completion Rate │    │
│   List Area  │  ├──────────────────┤    │
│              │  │   🌊 Wave Animation│    │
│  • Input     │  ├──────────────────┤    │
│  • Category  │  │   📊 Flow Bar      │    │
│  • Item List │  ├──────────────────┤    │
│              │  │   ⏱️ Time Display  │    │
│              │  └──────────────────┘    │
├──────────────┴──────────────────────────┤
│             Action Buttons              │
│   [Export] [Import] [Clear]             │
└─────────────────────────────────────────┘
```

## 🤝 Contribution Guidelines

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Create a Pull Request

## 📝 Open Source License

This project is licensed under the MIT License.

## 👨‍💻 Author

**haoquanjin**

- Gitee: [@haoquanjin](https://gitee.com/haoquanjin)

## 📧 Contact

For questions or suggestions, please submit an Issue via the Gitee repository.

---

**Happy Coding! 🎉**