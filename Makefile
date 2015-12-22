NPM_REGISTRY = "--registry=http://registry.npm.taobao.org"
#NPM_REGISTRY = ""

install:
	@npm install $(NPM_REGISTRY)

build:
	@./node_modules/loader/bin/build views .

start: install build
	@nohup ./node_modules/.bin/pm2 start app.js --name "enterprise" >> enterprise.log 2>&1 &

restart: install build
	@nohup ./node_modules/.bin/pm2 restart "enterprise" >> enterprise.log 2>&1 &

.PHONY: install build start restart
