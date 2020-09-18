# Internal Roadmap for the Nouri serverless App

## V0
- Admins can do these things manually through API endpoints.
  - Add new family manually
  - Query all family information
    - filter by status
    - filter by location
    - filter by name
    - filter by Slack username
  - Update family status
    - Contact information
      - Address
      - phone
      - email
      - Slack name
    - Family information
      - Family Size
    - Update Delivery Status
      - Invited
      - Accepted
      - Delivered
    - Delivery notes
      - Allergies
      - Delivery instructions
      - Preferrences
- Automated
  - Keep track of delivery history
    - What deliveries they were in
    - How many deliveries have we done for them.
NOTE: All routes will be private

## V1
- Admins can do these things manually through API endpoints
  - Create a new delivery
  - Assign families to the delivery and deliveries to families
  - Update delivery information
    - Summary
    - Routes (delivery order)
  - Query delivery information
  - Generate a downloadable pdf or Google docs document of the delivery information

## V2
- Automated
  - Automatically contact families in Slack about their availability for a delivery once a Delivery has been created.
  - Record a family's response about their delivery inquiry availability
  - Know when family has missed a deadline for responding to delivery availability
  - Know when the delivery list capacity is full
  - Know when families should be automatically added to a delivery without needing to contact them.

## V3
- Automated
  - Automate delivery route optimization
  - Ability to contact families through email, sms and/or voice about delivery acceptance.
