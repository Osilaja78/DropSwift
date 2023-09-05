# DropSwift
![Dropswift Screenshot](https://github.com/Osilaja78/DropSwift/assets/105312707/58866ce6-8aaf-4b75-9efe-8ec479fd8ad5)

DropSwift is an E-commerce dropshipping website with a sleek design and easy-to-use features. This README will guide you through the installation process and how to use the application.

## Installation

To install DropSwift on your local machine, follow these steps:

1. Clone the repository to your local machine.
```
git clone https://github.com/Osilaja78/$DropSwift.git
```

2. Install the required dependencies for the backend.
```
cd backend/
pip install -r requirements.txt
```

3. Start the backend server.
```
uvicorn main:app --reload
```

4. Install the required dependencies for the frontend.
```
cd ../frontend/
npm install
```

5. Start the frontend server.
```
npm run dev
```

## Usage

Once the backend and frontend servers are running, navigate to `http://localhost:3000` in your web browser to start using $DropSwift.

### Admin Panel

To access the admin panel, navigate to `http://localhost:3000/admin` and login with your admin credentials. From there, you can add, delete, and edit products, change order statuses of users, and perform other administrative tasks.

### User Account

To create a user account, click on the "Signup" button in the navigation bar and follow the on-screen instructions. Once you have created an account, you can login by clicking on the "Login" button and entering your credentials.

Once logged in, you can browse products, add them to your cart, and view your order status. To checkout, click on the "Checkout" button in your cart. 

## Conclusion

That's it! You should now be able to install and use $DropSwift on your local machine. If you have any issues or bugs to report, please open an issue in the repository.
