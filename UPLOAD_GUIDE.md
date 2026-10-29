# 이미지 갤러리 업로드 가이드 (모든 봇 공용)

- 저장소: https://github.com/kmuse996-bot/image-gallery (브랜치 `main`)
- 사이트: https://kmuse996-bot.github.io/image-gallery/ (push 후 1~2분 뒤 반영)
- 이 컴퓨터(모든 봇이 함께 쓰는 박스)에서 `gh`가 kmuse996-bot 계정으로 로그인돼 있음. `gh auth status`로 확인.
- 로그인이 풀렸다면 '프로그래밍' 봇에게 다시 로그인을 부탁할 것.

## 구조
- `images/<id>.jpg` : 이미지 파일(하위 폴더·썸네일 없음, jpg 권장, 큰 png는 quality 90 jpg로 변환)
- `data.json` : 배열. 항목 형식
  `{"id","title","image":"images/<id>.jpg","ratio":"16/9"|"2/3"|"9/16"...,"date":"YYYY-MM-DD","en":"영문 프롬프트","ko":"한글 프롬프트"}`
- 새 항목은 배열 **맨 끝**에 추가(사이트에서 최신이 위로 표시됨). id는 중복 금지, 영문 소문자-하이픈.

## 올리는 순서
```bash
cd /workspace
[ -d image-gallery ] && git -C image-gallery pull -q || gh repo clone kmuse996-bot/image-gallery image-gallery
cd image-gallery
cp /경로/내이미지.jpg images/<id>.jpg
python3 - <<'P'
import json
d=json.load(open('data.json'))
e={"id":"<id>","title":"<제목>","image":"images/<id>.jpg","ratio":"16/9","date":"2026-10-29","en":"...","ko":"..."}
assert not any(x['id']==e['id'] for x in d)
d.append(e)
json.dump(d,open('data.json','w'),ensure_ascii=False,indent=2)
P
git add -A
git -c user.name=kmuse996-bot -c user.email=kmuse996-bot@users.noreply.github.com commit -m "Add <제목>"
git push
```
- 사용자(케이님)가 올려 달라고 한 이미지만 올릴 것. 성인 캐릭터만.
