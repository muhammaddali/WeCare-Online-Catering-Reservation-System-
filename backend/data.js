import bcrypt from "bcryptjs";

const data = {
  users: [
    {
      name: "Admin",
      email: "admin@gmail.com",
      password: bcrypt.hashSync("123456"),
      isAdmin: true,
    },
    {
      name: "Customer",
      email: "user@example.com",
      password: bcrypt.hashSync("123456"),
      isAdmin: false,
    },
  ],
  products: [
    {
      //_id: '1',
      name: "Cupcakes",
      imageUrl:
        "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
      description:
        "A cupcake (also British English: fairy cake; Hiberno-English: bun) is a small cake designed to serve one person, which may be baked in a small thin paper or aluminum cup. As with larger cakes, frosting and other cake decorations such as fruit and candy may be applied.",
      price: 0.98,
      category: "desserts",
      slug: "cupcakes",
      inStock: 300,
    },
    {
      //_id: '2',
      name: "Cheesecake",
      imageUrl:
        "https://images.unsplash.com/photo-1508737804141-4c3b688e2546?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=686&q=80",
      description:
        "Cheesecake is a sweet dessert consisting of one or more layers. The main, and thickest, layer consists of a mixture of a soft, fresh cheese (typically cottage cheese, cream cheese or ricotta), eggs, and sugar. If there is a bottom layer, it most often consists of a crust or base made from crushed cookies (or digestive biscuits), graham crackers, pastry, or sometimes sponge cake.[1] Cheesecake may be baked or unbaked (and is usually refrigerated). Cheesecake is usually sweetened with sugar and may be flavored in different ways. Vanilla, spices, lemon, chocolate, pumpkin, or other flavors may be added to the main cheese layer. Additional flavors and visual appeal may be added by topping the finished dessert with fruit, whipped cream, nuts, cookies, fruit sauce, chocolate syrup, or other ingredients. ",
      price: 1.98,
      category: "desserts",
      slug: "cheesecake",
      inStock: 300,
    },
    {
      //_id: '3',
      name: "Chocolate Brownies",
      imageUrl:
        "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
      description:
        "A chocolate brownie or simply a brownie is a square or rectangular chocolate baked confection. Brownies come in a variety of forms and may be either fudgy or cakey, depending on their density. Brownies often, but not always, have a glossy skin on their upper crust. They may also include nuts, frosting, cream cheese, chocolate chips, or other ingredients. A variation made with brown sugar and vanilla rather than chocolate in the batter is called a blond brownie or blondie. The brownie was developed in the United States at the end of the 19th century and popularized there during the first half of the 20th century.",
      price: 1.48,
      category: "desserts",
      slug: "chocolate-brownies",
      inStock: 300,
    },
    {
      //_id: '4',
      name: "Ice Cream",
      imageUrl:
        "https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80",
      description:
        "Ice cream is a sweetened frozen food typically eaten as a snack or dessert. It may be made from milk or cream and is flavoured with a sweetener, either sugar or an alternative, and a spice, such as cocoa or vanilla, or with fruit such as strawberries or peaches. It can also be made by whisking a flavored cream base and liquid nitrogen together. Food coloring is sometimes added, in addition to stabilizers. The mixture is cooled below the freezing point of water and stirred to incorporate air spaces and to prevent detectable ice crystals from forming. The result is a smooth, semi-solid foam that is solid at very low temperatures (below 2 °C or 35 °F). It becomes more malleable as its temperature increases.",
      price: 1.48,
      category: "desserts",
      slug: "ice-cream",
      inStock: 300,
    },
    {
      //_id: '5',
      name: "Egg",
      imageUrl:
        "https://images.unsplash.com/photo-1607690424560-35d967d6ad7c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZWdnfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60",
      description: "Egg",
      price: 0.48,
      category: "voorgerechten",
      slug: "egg",
      inStock: 300,
    },
    {
      //_id: '5',
      name: "yes",
      imageUrl:
        "https://images.unsplash.com/photo-1660486965992-c921b45b7e65?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60",
      description: "yes",
      price: 0.48,
      category: "voorgerechten",
      slug: "yes",
      inStock: 300,
    },
  ],
};

export default data;
