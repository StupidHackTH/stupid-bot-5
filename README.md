# stupid-bot-5

discord bot for stupid Hackathon 5

Most of the starting code came from `Getting started` in the [discord.js](https://discordjs.guide/) guide

# isn't slash commands not supported in discord.js???

yeah, but Tar has done some black magic to make it work (you can see how in the `/tools` directory)

# how was it deployed?

heroku... (sad noises)

# how 2 use the bot

[google docs](https://docs.google.com/document/d/1IrMchuuHvfELohlUa4GmPnXEVT9_TFrp6-GH_Z4N4cw/edit?usp=sharing)

## verify
```
stp verify
/verify
```

* ใช้ verify eventpop ticket เพื่อรับ Role Participant หรือ Attendee ตามประเภทของตั๋วที่ได้รับ
* Order Number: “#XXXXX-XXXXXXX”

## add
```
stp add <@member_1> <@member_2> <@member_3> <@member_4>
/add <@member_1> <@member_2> <@member_3> <@member_4>
```

* สร้างทีมใหม่: stp add
* เพิ่มคนอื่นเข้าทีม (เพิ่มพร้อมสร้างทีมได้): stp add @member_1 @member_2

โดย:
* กรณีคนเรียกไม่มีทีมจะสุ่มทีมให้คนเรียกก่อน แล้วค่อยเพิ่มสมาชิก
* ทุกคนที่เพิ่มต้องมี role Participant / Attendee
* ทุกคนในทีมสามารถเพิ่มคนเข้ามาได้หมด ( ไม่จำเป็นจะต้องเป็น admin )
* ทุกคนที่เพิ่มต้องไม่มี team อยู่แล้ว ( 1 คนจะอยู่ได้ team เดียว )
* มีได้มากกว่า 5 คน ( slash command มันทำ dynamic ยังไม่ได้เลยใส่ได้แค่ทีละสี่คน )

## leave
```
stp leave
/leave
```

* ออกจากทีม

## color
```
stp color #ABCDEF
/color #ABCDEF
```

* เปลี่ยนสีทีม

## name
```
stp name Kewl Name
/name Kewl Name 
```

* เปลี่ยนชื่อทีม

## info
```
stp info
/info
```

* ดูข้อมูลเกี่ยวกับทีม

## admin
```
stp admin <@member_1> <@member_2> <@member_3> <@member_4>
/admin <@member_1> <@member_2> <@member_3> <@member_4>
```

* ให้ยศ admin กับคนที่เรา mention
* admin จะสามารถ submit ผลงาน และเตะคนออกจากทีม

## de-admin
```
stp de-admin <@member_1> <@member_2> <@member_3> <@member_4>
/de-admin <@member_1> <@member_2> <@member_3> <@member_4>
```

* ริบยศ admin จากคนที่เรา mention

## submithelp
```
stp submithelp
```
* รับ instruction ในการส่งผลงาน
* ผลงานที่ส่งเป็น video youtube ยาว 3 นาที
