# Feature Collection with Quick View – Shopify Integration

This setup allows customers to view product details and add items to the cart directly from the collection page using a Quick View modal.

---

## ✅ Installation Instructions

Follow these steps to integrate the **Feature Collection with Quick View** feature into your Shopify theme:

---

### 1. Create a New Section

- **File Name**: `feature-collection-with-quick-view.liquid`
- **Steps**:
  1. Go to **Online Store > Themes > Edit Code**
  2. Under the **Sections** folder, click **Add a new section**
  3. Name it: `feature-collection-with-quick-view`
  4. Copy the code from your `feature-collection-with-quick-view` file and paste it here
  5. Save the file
  6. Then go to **Customize Theme**
     - Find the new section called **"Feature Collection QV"**
     - Add it to the desired homepage location
     - Click **Save**

---

### 2. Create a New Snippet for CSS

- **File Name**: `quick-view-css.liquid`
- **Steps**:
  1. In the theme editor, under **Snippets**, click **Add a new snippet**
  2. Name it: `quick-view-css`
  3. Copy the CSS code from your `quick-view-css.liquid` file and paste it here
  4. Save the file

---

### 3. Add JavaScript File

- **File Name**: `quick-view.js`
- **Steps**:
  1. Under **Assets**, click **Add a new asset**
  2. Choose **.js**, name it `quick-view.js`
  3. Paste your `quick-view.js` code into the file
  4. Save it

- **Then include it in your theme**:
  1. Open `theme.liquid`
  2. Before the closing `</body>` tag, add:

  ```liquid
  {{ 'quick-view.js' | asset_url | script_tag }}
  
### 🔗 Storefront Access
Preview URL: https://ecomelia-solutions.myshopify.com/

Password: abc

### 📩 Contact
If you have any questions, feel free to reach out:

Email: ecommerce.web.expert@gmail.com
