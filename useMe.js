const customer = {
  name: "Adesh Jadhav",
  phone: "9527370288",
  email: "jadhavadesh13061@gmail.com",
  isGold: true,
  _id: "65bb195079bbac51e5091694",
};

const rental = {
  _id: "65bb5c3744956a836a6dd650",
  customer: {
    name: "Adesh Jadhav",
    phone: "9527370288",
    email: "jadhavadesh13061@gmail.com",
    isGold: true,
    _id: "65bb195079bbac51e5091694",
  },
  movies: [
    {
      title: "Skyfall",
      dailyRentalRate: 13,
      _id: "65b37b5bce0e38f84eb0d0a9",
    },
    {
      title: "Star Wars",
      dailyRentalRate: 12,
      _id: "65b37b6ace0e38f84eb0d0ad",
    },
  ],
  dateOut: "2024-02-01T08:53:54.897Z",
  dateReturned: "2024-02-11T00:00:00.000Z",
  rentalFee: 25,
  __v: 0,
};

const rentalMovies = [
    {id: 1, title: 'Movie1'},
    {id: 2, title: 'Movie2'},
    {id: 3, title: 'Movie3'},
]






let text = `Dear ${customer.name},

Thank you for choosing Vidly for your movie rental needs. Here are the details of the movies you have rented:

Rental ID: ${rental._id}
Customer ID: ${customer._id}
Date of Rental: ${rental.dateOut}

Movies Rented:
${rentalMovies
  .map(
    (movie, index) => `${index + 1}. Movie Title: ${movie.title}
   Genre: ${movie.genre.name}
   Rental Fee: ${movie.dailyRentalRate}
`
  )
  .join("")}

Total Rental Fee: ${rental.rentalFee}
Date Return: ${rental.dateReturned}

Please ensure to return the movies by the specified return date to avoid any late fees. If you have any questions or concerns, feel free to contact our customer support.

Thank you again for choosing Vidly. We hope you enjoy your movie-watching experience!

Best regards,
Vidly Team

`;
