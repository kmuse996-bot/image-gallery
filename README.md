# 이미지프롬 갤러리

이미지와 프롬프트(영어·한글)를 함께 보고 한 번에 복사하는 웹 갤러리입니다.
사이트: https://kmuse996-bot.github.io/image-gallery/

## 새 항목 추가하는 법
1. 이미지 파일을 `images/` 폴더에 올립니다 (예: `images/my_new.jpg`).
2. `data.json` 배열 끝에 항목을 하나 추가합니다 (최신 항목이 맨 위에 표시됨):
```json
{
  "id": "my-new",
  "title": "제목",
  "image": "images/my_new.jpg",
  "ratio": "9/16",
  "date": "2026-10-29",
  "en": "English prompt\n줄바꿈은 \\n",
  "ko": "한글 프롬프트"
}
```
3. 커밋·푸시하면 1~2분 뒤 사이트에 반영됩니다. 가로 이미지는 `ratio`를 `"16/9"`로.
