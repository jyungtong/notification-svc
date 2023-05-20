FROM mongo

COPY notification-type.json ./notification-type.json
CMD mongoimport --host mongodb --username test --password test --authenticationDatabase admin --db test --collection notificationtypes --type json --file /notification-type.json --jsonArray
