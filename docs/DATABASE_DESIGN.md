# Database Design

DynamoDB is a non relational database but it has a paradigm that is different from other NoSql databases like MongoDB.

DynamoDB best practices would only need one table for all of our needs. This is possible by optimizing the table for the queries you will need first rather than creating the models and then figuring out how to join tables or connecting different objects through foreign keys.

## Overview
| Primary Key or Hash | Sort Key or Range | Other Attributes |
| ------------- | ------------- | ----- |
| chapterState | chapterDocument | details|

## Overview, second layer of detail
| Primary Key or Hash | Sort/Range      | Other Attributes |
| ------------------- | --------------- | ------------------------------------------ |
| seattle-eastside    | family-email    | firstn, lastn, email, phone, street1, status, history, etc.|
| seattle-eastside    | delivery-date   | driver, [starting stops] [family-list in route order], end, [costs] |
| seattle-eastside    | stats-year      | [costs], delivery-count |

## Example
| Primary Key/Hash | Sort/Range            | Other Attributes |
| ---------------- | --------------------- | ------------------------------------------- |
| seattle-eastside | family-jane@email.com | jane, doe, jane@email.com, active, [A20200904, D20200804] |
| seattle-eastside | delivery-20200904     | [joe, [address1, address2] [jane@email.com, alice@email.com], endaddress] |
| seattle-eastside | stats-2020            | driver $150, total: $500, food $100 ], 37 |
* A20200904: Accepted 2020 09 04 Delivery Date
* D20200804: Delivered 2020 08 04