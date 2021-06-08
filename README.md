## Reporting tool fastify app

To run the application be sure to be running docker then do `docker build . -t reporting-tool-backend:latest` to build it.
After that do `docker run -p 8080:8080 reporting-tool-backend`

### endpoints

- `POST /report/listing` should have a body with a property call listing that should have the CSV

    example: `curl --location --request POST 'localhost:8080/report/listing' \
--form 'listing=@"<location_of_listing_file>"'`
    
    this will return a json with the following info

    ```
  {
    "distribution": [
        {
            "make": "Mercedes-Benz",
            "percentage": "16.33%",
            "rawPercentage": 16.333333333333332
        },
        {
            "make": "Toyota",
            "percentage": "16.00%",
            "rawPercentage": 16
        },
        {
            "make": "Audi",
            "percentage": "14.00%",
            "rawPercentage": 14.000000000000002
        },
        {
            "make": "Renault",
            "percentage": "14.00%",
            "rawPercentage": 14.000000000000002
        },
        {
            "make": "Mazda",
            "percentage": "13.33%",
            "rawPercentage": 13.333333333333334
        },
        {
            "make": "VW",
            "percentage": "10.33%",
            "rawPercentage": 10.333333333333334
        },
        {
            "make": "Fiat",
            "percentage": "9.00%",
            "rawPercentage": 9
        },
        {
            "make": "BWM",
            "percentage": "7.00%",
            "rawPercentage": 7.000000000000001
        }
    ],
    "averagePriceByDealer": [
        {
            "dealer": "private",
            "avg": "€ 26.080,-",
            "rawAvg": 26080.48
        },
        {
            "dealer": "other",
            "avg": "€ 25.318,-",
            "rawAvg": 25317.76404494382
        },
        {
            "dealer": "dealer",
            "avg": "€ 25.037,-",
            "rawAvg": 25037.33823529412
        }
    ]
    }
    ```
    

- `POST /report/contact` should have a body with two properties one call listing and the other one called contact both pointing to its respective files

    example: `curl --location --request POST 'localhost:8080/report/contact' \
  --form 'listing=@"<location_of_listing_file>"' \
  --form 'contact=@"<location_of_contact_file>"'`
  
    this will return a json with the following info

    ```
  {
    "listingsContactsByMonths": [
        [
                     {
                "contactedTimes": 1,
                "year": 2020,
                "month": 0,
                "id": "1278",
                "make": "Audi",
                "price": "€ 48.593,-",
                "mileage": "5.500 KM",
                "seller_type": "dealer"
            },
            {
                "contactedTimes": 1,
                "year": 2020,
                "month": 0,
                "id": "1284",
                "make": "Renault",
                "price": "€ 38.361,-",
                "mileage": "1.000 KM",
                "seller_type": "other"
            },
            {
                "contactedTimes": 1,
                "year": 2020,
                "month": 0,
                "id": "1288",
                "make": "VW",
                "price": "€ 48.205,-",
                "mileage": "4.500 KM",
                "seller_type": "other"
            },
            {
                "contactedTimes": 1,
                "year": 2020,
                "month": 0,
                "id": "1289",
                "make": "Mercedes-Benz",
                "price": "€ 32.480,-",
                "mileage": "9.500 KM",
                "seller_type": "dealer"
            }
        ],
        [
                     {
                "contactedTimes": 2,
                "year": 2020,
                "month": 1,
                "id": "1289",
                "make": "Mercedes-Benz",
                "price": "€ 32.480,-",
                "mileage": "9.500 KM",
                "seller_type": "dealer"
            },
            {
                "contactedTimes": 2,
                "year": 2020,
                "month": 1,
                "id": "1294",
                "make": "Mercedes-Benz",
                "price": "€ 5.682,-",
                "mileage": "4.000 KM",
                "seller_type": "dealer"
            },
            {
                "contactedTimes": 2,
                "year": 2020,
                "month": 1,
                "id": "1299",
                "make": "Fiat",
                "price": "€ 19.832,-",
                "mileage": "8.000 KM",
                "seller_type": "private"
            },
            {
                "contactedTimes": 1,
                "year": 2020,
                "month": 1,
                "id": "1080",
                "make": "Fiat",
                "price": "€ 42.909,-",
                "mileage": "7.500 KM",
                "seller_type": "dealer"
            }
        ],
    }
    ```
- `POST /report/contact/avg?percentage=30` should have a body with two properties one call listing and the other one called contact both pointing to its respective files you can also define a percentage which will be the one that will tell you the cut is you you set for example 30% you will get the average of 30% most contacted listings

    should return a json like this.
    ```
  {
    "avgPrice": "€ 24.639,-"
   }
    ```

