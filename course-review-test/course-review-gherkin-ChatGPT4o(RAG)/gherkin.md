Feature: Course Review Website

  Scenario: Navigating between Course Info Search Area and Discussion Area
    Given I am on any page
    When I click on "課程資訊查詢區" or "討論區" in the header
    Then I should be redirected to the corresponding page

  Scenario: Displaying Header on Course Info Search Area
    Given I am on the "課程資訊查詢區" page
    Then I should see a header with a dark grey background
    And the header should contain an icon and the text "課程評價網" on the left
    And on the right, there should be two clickable options: "課程資訊查詢區" and "討論區"

  Scenario: Search Filters in Course Info Search Area
    Given I am on the "課程資訊查詢區" page
    Then I should see a light grey background below the header
    And I should see a search input field at the top
    And I should be able to select between "依課名查詢" or "依老師名字查詢"
    When I type in a keyword
    Then I should see filtered course information based on the keyword and selected search option

  Scenario: Displaying Course Information Cards
    Given I am on the "課程資訊查詢區" page
    When I perform a search
    Then the left side should display course information cards
    And each card should display the course name, teacher's name, course rating, and discussion heat
    And the course rating should have three categories: "課程涼度", "給分甜度", and "考試難度" with star icons representing average ratings rounded to the nearest whole number
    And the right side of each card should display the discussion heat count with an icon

  Scenario: Selecting a Course Card and Viewing Reviews
    Given I have performed a search
    When I click on a course card
    Then the selected card should have a dark grey border to highlight it
    And I should see a button labeled "新增課程評論" on the right side
    And the button should display a form for adding a course review when clicked
    And below the button, I should see existing user reviews for the selected course
    And each review card should display the user's name, review content, and ratings for "課程涼度", "給分甜度", and "考試難度" with star icons

  Scenario: Submitting a New Course Review
    Given I have clicked on "新增課程評論" for a course
    When I fill in the form with my name, review content, and ratings
    And I submit the review
    Then the new review should be added to the top of the review list
    And the form should switch back to the "顯示課程評論" mode

  Scenario: Displaying Header on Discussion Area
    Given I am on the "討論區" page
    Then I should see a header with the same dark grey background as "課程資訊查詢區"
    And the active page in the header should be highlighted while the inactive page is dimmed

  Scenario: Chat Room in Discussion Area
    Given I am on the "討論區" page
    Then I should see a chat area with a light grey background
    And below the chat area, I should see input fields for selecting color, nickname, and message content
    And I should be able to enter a message and send it by clicking a button or pressing Enter
    And each message should display the timestamp, nickname with selected color, and message content
    And the chat history should update with each new message

  Scenario: Initial Fake Data for Course Info Search Area
    Given I visit the "課程資訊查詢區" page
    Then I should see at least 6 course cards with pre-generated fake data
    And each course should have at least 5 reviews generated from fake data
    And all the data should be stored in a JSON file

  Scenario: Initial Fake Data for Discussion Area
    Given I visit the "討論區" page
    Then I should see at least 3 different users and 10 initial chat messages generated from fake data
    And all the data should be stored in a JSON file
