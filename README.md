# mobile

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### basic design
记账 && 库存管理
库存管理
add （ID，图片，名称，货号，数量，单套成本） ===》 添加成功后记账处自动++
delete （单个删或批量删）===》删除时询问是否同步更新记账数据
update (除了ID 都能修改) ===》修改自动修改记账处
show (图片、名称、货号、在售数量、单套成本、售出状态)

记账
add (ID, 支出或收入, 类别，num, 时间，mark)
delete
update(mark, num, mark, time)
show(按时间展示记录了，头部显示总和)
