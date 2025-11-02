// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBOQlShyNA3dVMwtGpEeLjZ8plJaCAKWf4",
  authDomain: "story-keeper-31366.firebaseapp.com",
  projectId: "story-keeper-31366",
  storageBucket: "story-keeper-31366.firebasestorage.app",
  messagingSenderId: "372957485701",
  appId: "1:372957485701:web:4389bce018ec827fb167ec",
  measurementId: "G-ND6FMSS730"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Submit Cerita
const form = document.getElementById("story-form");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const file = document.getElementById("fileInput").files[0];

    let fileURL = "";

    if (file) {
      const storageRef = ref(storage, 'uploads/' + file.name);
      await uploadBytes(storageRef, file);
      fileURL = await getDownloadURL(storageRef);
    }

    await addDoc(collection(db, "stories"), {
      title,
      content,
      fileURL,
      timestamp: new Date()
    });

    alert("Cerita berhasil disimpan!");
    form.reset();
  });
}

// Menampilkan Cerita di Halaman Utama
const storyContainer = document.getElementById("story-container");
if (storyContainer) {
  const querySnapshot = await getDocs(collection(db, "stories"));
  querySnapshot.forEach((doc) => {
    const story = doc.data();
    const div = document.createElement("div");
    div.classList.add("story-card");
    div.innerHTML = `
      <h3>${story.title}</h3>
      <p>${story.content.substring(0, 100)}...</p>
      ${story.fileURL ? filePreview(story.fileURL) : ""}
    `;
    storyContainer.appendChild(div);
  });
}

// Fungsi untuk preview file
function filePreview(url) {
  if (url.match(/\.(jpeg|jpg|png|gif)$/i)) {
    return `<img src="${url}" alt="gambar">`;
  } else if (url.match(/\.(mp4|webm)$/i)) {
    return `<video src="${url}" controls></video>`;
  } else {
    return `<a href="${url}" target="_blank">📄 Lihat File</a>`;
  }
}
