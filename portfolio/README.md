# Mohammad Aquib Siddiquee - Portfolio Website

A simple static website. **No installation, no build step, no server.**
It is just these files:

```
portfolio/
├── index.html      <- all the text and structure of the page
├── style.css       <- colours, fonts, layout
├── script.js       <- small interactions (menu, filters, Arabic switch)
├── README.md       <- this guide
├── assets/
│   ├── images/     <- put your own photos here
│   ├── logos/      <- company logos (Tasnee, Ma'aden, DRA Global)
│   └── icons/      <- browser tab icon
└── Mohammad-Aquib-Siddiquee-CV.pdf   <- YOU add this file (see step 4)
```

---

## 1. Test the website on your computer

1. Download and unzip the project folder.
2. Open the folder.
3. Double-click `index.html`.
4. The website opens in your browser. That's it.

To see your edits: save the file, then press **F5** (refresh) in the browser.

---

## 2. Change your information

Open `index.html` with **Notepad** (Windows) or **TextEdit** (Mac, use Format > Make Plain Text). A free editor like VS Code is nicer, but not required.

Search for these comments (press **Ctrl+F**). Edit only the text, never the `<` `>` parts:

| What you want to change | Search for |
|---|---|
| Name, title, intro text | `EDIT YOUR NAME, TITLE AND INTRO TEXT HERE` |
| Phone, email, LinkedIn | `EDIT YOUR CONTACT INFORMATION HERE` |
| Career timeline | `EDIT YOUR TIMELINE HERE` |
| Jobs, dates, responsibilities | `EDIT YOUR EXPERIENCE HERE` |
| Skills | `EDIT YOUR SKILLS HERE` |
| Certifications | `EDIT YOUR CERTIFICATIONS HERE` |
| Projects / achievements | `EDIT YOUR PROJECTS HERE` |

**Phone number, email and LinkedIn appear in several places.** Use Find & Replace (Ctrl+H) to change them everywhere:
- Phone: `+966565430687` (buttons) and `+966 565 430 687` (text)
- Email: `aquibsid.work@gmail.com`
- LinkedIn: `mohammad-aquib-siddiquee-388b64162`

**When NEBOSH is finished:** search `NEBOSH`, change "IN PROGRESS" / "in progress" to "Completed" only after you pass.

**Colours:** open `style.css`. The first lines hold the colours (for example `--amb` is amber).

### Arabic version
English text is in `index.html`. The Arabic text is at the bottom of `script.js` in a list that looks like `"English sentence": "Arabic sentence"`.
If you change an English sentence, also change the English side of that line in `script.js`. If you don't, that sentence just stays English in Arabic mode (nothing breaks).

---

## 3. Replace images and logos

- Put photos in `assets/images/`. Use JPG or WebP, under about 300 KB each.
- Add one to the page like this: `<img src="assets/images/my-photo.jpg" alt="Describe the photo" loading="lazy">`
- Company logos are in `assets/logos/`. To replace one, save the new file with the **same name** (for example `tasnee.png`).
- Logos are shown only to name your employers. They do not mean the companies endorse you.

---

## 4. Add your CV

1. Export your CV as a PDF.
2. Name it exactly: `Mohammad-Aquib-Siddiquee-CV.pdf`
3. Put it in the main folder, next to `index.html`.

The two "Download CV" buttons then work. To use a different file name, search `index.html` for `Mohammad-Aquib-Siddiquee-CV.pdf` (it appears twice) and change both.
Until the PDF is uploaded, the online site makes the button open an email to you instead.

---

## 5. Put the website online with GitHub Pages (free)

1. Go to https://github.com and create a free account.
2. Click the **+** at the top right, then **New repository**.
3. Name it `portfolio` (or anything), keep it **Public**, click **Create repository**.
4. Click **uploading an existing file**.
5. Drag in **the files and folders inside** your `portfolio` folder (`index.html`, `style.css`, `script.js`, `assets`, your CV PDF). Click **Commit changes**.
6. Go to **Settings > Pages**.
7. Under "Build and deployment" choose **Deploy from a branch**, branch **main**, folder **/ (root)**, click **Save**.
8. Wait 1-2 minutes and refresh. GitHub shows your website address at the top of that page.

To update later: open the repository, click **Add file > Upload files**, upload the changed file, commit.

## 6. Put the website online with Netlify (easiest)

1. Go to https://app.netlify.com/drop
2. Sign up (free) if asked.
3. Drag your **whole `portfolio` folder** onto the page.
4. Netlify gives you a web address in a few seconds. You can rename it in **Site settings**.

To update: use the **Deploys** tab and drag the folder in again.

(Vercel also works. Import the folder as a project with no build command.)

---

## 7. After you have your web address

Open `index.html`, search `CANONICAL URL`, delete the two comment markers (`<!--` and `-->`) around the next line and replace `YOUR-DOMAIN-HERE` with your address. This helps Google.

## If something looks wrong
- Changes not showing: refresh with Ctrl+F5.
- Page looks unstyled: `style.css` must be in the same folder as `index.html`.
- Logo or image missing: check the file name and the folder match the `src="..."` exactly (capital letters matter online).
