function openNav() {

  document.getElementById('nav').classList.remove("-right-96");


}

function closeNav() {
  console.log("here");
  document.getElementById('nav').classList.add("-right-96");

}

function speak2lead() {
  document.getElementById('speak2lead').style.display = "block";
  document.getElementById('stemninjas').style.display = "none";
  document.getElementById('npo-landing').style.display = "none";
}

function stemninjas() {
  document.getElementById('speak2lead').style.display = "none";
  document.getElementById('stemninjas').style.display = "block";
  document.getElementById('npo-landing').style.display = "none";
}

const carouselText = [
  {text: "building projects.", color: "#f1f5f9"},
  {text: "helping others.", color: "#f1f5f9"},
  {text: "learning stuff.", color: "#f1f5f9"},
  {text: "telling stories.", color: "#f1f5f9"},
  {text: "leading ventures.", color: "#f1f5f9"},
  {text: "Lo-Fi music.", color: "#f1f5f9"}
]

$( document ).ready(async function() {
  carousel(carouselText, "#feature-text")
});

async function typeSentence(sentence, eleRef, delay = 100) {
  const letters = sentence.split("");
  let i = 0;
  while(i < letters.length) {
    await waitForMs(delay);
    $(eleRef).append(letters[i]);
    i++
  }
  return;
}

async function deleteSentence(eleRef) {
  const sentence = $(eleRef).html();
  const letters = sentence.split("");
  let i = 0;
  while(letters.length > 0) {
    await waitForMs(100);
    letters.pop();
    $(eleRef).html(letters.join(""));
  }
}

async function carousel(carouselList, eleRef) {
    var i = 0;
    while(true) {
      updateFontColor(eleRef, carouselList[i].color)
      await typeSentence(carouselList[i].text, eleRef);
      await waitForMs(1500);
      await deleteSentence(eleRef);
      await waitForMs(500);
      i++
      if(i >= carouselList.length) {i = 0;}
    }
}

function updateFontColor(eleRef, color) {
  $(eleRef).css('color', color);
}

function waitForMs(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
