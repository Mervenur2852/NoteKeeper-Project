// ! Ay dizisi
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// ! html den gelen elemanlar

const addBox = document.querySelector(".add-box");
const popupBoxContainer = document.querySelector(".popup-box");
const popupBox = document.querySelector(".popup");
const closeBtn = document.querySelector("header i");
const form = document.querySelector("form");
const wrapper = document.querySelector(".wrapper");
const popupTitle = document.querySelector("header p")
const submitBtn = document.querySelector("#submit-btn")

// ! localstrogeden noteları al ve eğer localde note yoksa boş dizi döndür
let notes = JSON.parse(localStorage.getItem("notes")) || [];
 // ! güncelleme için gerekn değişkenler
 let isUpdate = false
 let updateId = null
// ! fonksiyon ve olay izleyicileri

addBox.addEventListener("click", () => {
  popupBoxContainer.classList.add("show");
  popupBox.classList.add("show");
  // arka plandaki sayfa kaydırılmasını engelle
  document.querySelector("body").style.overflow = "hidden";
});
// closeBtn tıklayınca opupBoxContainer ve popup a eklenene classları kaldır
closeBtn.addEventListener("click", () => {
  popupBoxContainer.classList.remove("show");
  popupBox.classList.remove("show");
  // arka plandaki sayfa kaydırılmasını tkrardan aktif et
  document.querySelector("body").style.overflow = "auto";
});

// menu kısmını ayarlayan fonksiyon

function showMenu(elem) {
  // parentElement bir elemanın kapsam erişmek için kullanılır

  // tıklanılan elemanın kapsamına eriştikten sonra buna bir class ekledik
  elem.parentElement.classList.add("show");

  // tıklanılan yer menu kısmı haricindeyse show clasını kaldır

  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    }
  });
}
// wrapper kısımdaki tıklamaarı izle

wrapper.addEventListener("click", (e) => {
  // tıklanılan kısım i etiketi değilse ya da kapsam dışınaysa show clasını kaldır
  if (e.target.classList.contains("bx-dots-horizontal-rounded")) {
    showMenu(e.target);
  }
  // eğer sil ikonuna tıklandıysa
  else if (e.target.classList.contains("deleteIcon")) {
    const res = confirm("Bu notu silmek istediğinizden emin misiniz?") 
    if(res){
        // tıklanılan note elemanına eriş
    const note = e.target.closest(".note");
    //notun id sine eriş
    const noteId = note.dataset.id;

    // notes dizini dön ve id si nodeId ye eşit olan elemanı diziden kaldır
    notes = notes.filter((note) => note.id != noteId);

    // localStroge güncelle
    localStorage.setItem("notes", JSON.stringify(notes));
    // renderNotes fonksiyonunu çalıştır
    renderNotes();
  }
    }
  // eğer güncelle ikonuna tıklanırsa 
  else if(e.target.classList.contains("updateIcon")){
    const note =e.target.closest(".note")
    // note lemeanının ıdsine eriş
    const noteId = parseInt(note.dataset.id)
    // note dizisi içerisindeki id si bilinen elemanı bul
    const foundeNote = notes.find((note)=> note.id === noteId)


    // popup içersindeki elemanlara note değerlerini ata
    form[0].value = foundeNote.title
    form[1].value = foundeNote.description

    // güncelleme modunu aftif et
    isUpdate = true
    updateId = noteId

   // popup aç
    popupBoxContainer.classList.add("show")
    popupBox.classList.add("show")

    // popup içerisindeki gerekli alanları update egöre düzenle
    popupTitle.textContent="Update Note"
    submitBtn.textContent="Update"
  }
});

// form a bir olay izleyicisi ekle ve form içerisindeki verilere eriş

form.addEventListener("submit", (e) => {
  // form göderidiğinde sayfa yenilemesini engelle
  e.preventDefault();

  // form içerisindeki verilere eriş
  let titleInput = e.target[0];
  let descriptionInput = e.target[1];

  // form elemanlarının içerisindeki değerlere eriş
  let title = titleInput.value.trim();
  let description = descriptionInput.value.trim();

  // eğer title ve description değeri yoksa uyarı ver
  if (!title && !description) {
    alert("lütfen formdaki gerekli kısımları doldurunuz !");
  }
  // eğer title ve description değeri varsa gerekli bilgileri oluşlur

  const date = new Date();
  let id = new Date().getTime();
  let day = date.getDate();
  let year = date.getFullYear();
  let month = months[date.getMonth()];

  // eğer güncelleme modunda ise
  if (isUpdate){
    // güncelleme yapılıcak elemanın dizi içerisideki indexini bul
    const noteIndex = notes.findIndex((note)=>{
       return note.id == updateId

       })
    // dizi içerisindeki yukarıda bulunan index deki elemanın değerlerini güncelle
    notes[noteIndex] ={
      ...notes[noteIndex + 1],
      title,
      description,
      id,
      date: `${month} ${day}, ${year}`,
      id,
    }
    // güncelleme modunu kapat ve popup içerisindeki elemanları eskiye çevir
    isUpdate= false
    updateId = null
    popupTitle.textContent = "New Note"
    submitBtn.textContent = "Add Note"
  } else {
     // elde edilen verilerin bir note objesi altında topla

  let noteInfo = {
    title,
    description,
    date: `${month} ${day}, ${year}`,
    id,
  };
  notes.push(noteInfo);
  }

 
  
  // note objesini localstrorage a ekle
  localStorage.setItem("notes", JSON.stringify(notes));

  titleInput.value = "";
  descriptionInput.value = "";
  // popup u kapat
  popupBoxContainer.classList.remove("show");
  popupBox.classList.remove("show");
  // arka plandaki sayfa kaydırılmasını tkrardan aktif et
  document.querySelector("body").style.overflow = "auto";

  // not eklendikten sonra notları render et

  renderNotes();
});

// ! localstroge deki verilere göre ekrana note kartları dender eden fonksiyo

function renderNotes() {
  // eğer localstoage da not verisi yoksa fonksiyonu durdur
  if (!notes) return;

  // önce mevcut noteları kaldır
  document.querySelectorAll(".note").forEach((li) => li.remove());

  // note dizisindeki herbir eleman için ekrana bir note kartı render et

  notes.forEach((note) => {
    let liTag = ` <li class="note"data-id='${note.id}'>
          <!-- details -->
          <div class="details">
            <p class="title">${note.title}</p>
            <p class="description">${note.description}</p>
          </div>
          <!-- bottom -->
          <div class="bottom-content">
            <span>${note.date}</span>
            <div class="settings">
              <i class='bx bx-dots-horizontal-rounded' ></i>
              <ul class="menu">
                <li class='updateIcon'><i class='bx bx-edit' ></i>Düzenle</li>
                <li class='deleteIcon'><i class= 'bx bx-trash'></i> sil</li>
              </ul>
            </div>
          </div>
        </li>`;
    // insertAdjacentHTML metodu belirli bir öğeyi bir html elemanına göre sıralı şekilde eklemek için kullanılır
    // bu metod hangi konuma ekleme yapılıcak ve hangi eleman ekklenecek bunu belirtmenizi ister
    addBox.insertAdjacentHTML("afterend", liTag);
  });
}

document.addEventListener("DOMContentLoaded", () => renderNotes());
