🍽️ TasteCart - Food Delivery Platform

A comprehensive food delivery platform built with Django that connects food lovers with the best restaurants across Bangladesh. TasteCart provides a seamless experience for customers, restaurant owners, and delivery riders.

[![bNHzP.png](https://s14.gifyu.com/images/bNHzP.png)](https://gifyu.com/image/bNHzP)

## 🌟 Features

### For Customers
- **User Registration & Authentication** - Secure account creation and login
- **Restaurant Discovery** - Browse restaurants by category, location, and ratings
- **Menu Browsing** - View detailed menu items with images, descriptions, and prices
- **Smart Cart Management** - Add, update, and remove items with real-time updates
- **Order Tracking** - Track order status from preparation to delivery
- **Review System** - Rate and review restaurants and food items
- **Order History** - View past orders and reorder favorites
- **Real-time Notifications** - Get updates on order status and promotions

### For Restaurant Owners
- **Restaurant Management** - Complete restaurant profile with images and details
- **Menu Management** - Add, edit, and manage menu items with categories
- **Order Management** - Accept, reject, and track incoming orders
- **Dashboard Analytics** - View order statistics and performance metrics
- **Real-time Order Updates** - Manage order status and customer communications
- **Business Hours Management** - Set opening/closing times and availability

### For Delivery Riders
- **Rider Dashboard** - Dedicated interface for delivery management
- **Order Assignment** - Accept and manage delivery requests
- **Delivery Tracking** - Update delivery status and manage routes
- **Delivery History** - Track completed deliveries and earnings
- **Profile Management** - Manage rider information and availability

## 🛠️ Technology Stack

- **Backend Framework**: Django 5.2.4
- **Database**: SQLite3 (Development) / PostgreSQL (Production Ready)
- **Frontend**: HTML5, CSS3, TailwindCSS, JavaScript
- **Authentication**: Django Custom User Model
- **File Storage**: Django File Storage (Images)
- **AJAX**: Real-time cart and order updates
- **Security**: CSRF Protection, Django Security Middleware

## 📁 Project Structure

```
tastecart/
├── 📁 authentication/          # User authentication and profiles
│   ├── models.py              # Custom User model, Profile model
│   ├── views.py               # Login, registration, profile views
│   ├── urls.py                # Authentication URLs
│   └── migrations/            # Database migrations
│
├── 📁 home/                   # Home page and core features
│   ├── models.py              # Notifications, Feedback, Order History
│   ├── views.py               # Home page, about us, contact
│   ├── context_processors.py  # Global context (notifications)
│   └── migrations/            # Database migrations
│
├── 📁 restaurant/             # Restaurant management
│   ├── models.py              # Restaurant, Menu models
│   ├── views.py               # Restaurant views, owner dashboard
│   ├── forms.py               # Restaurant and menu forms
│   ├── decorators.py          # Owner permission decorators
│   └── migrations/            # Database migrations
│
├── 📁 order/                  # Order and cart management
│   ├── models.py              # Cart, Order models
│   ├── views.py               # Cart operations, order processing
│   ├── context_processors.py  # Cart count context
│   └── migrations/            # Database migrations
│
├── 📁 rider/                  # Delivery rider management
│   ├── models.py              # Rider model
│   ├── views.py               # Rider dashboard, delivery management
│   └── migrations/            # Database migrations
│
├── 📁 templates/              # HTML templates
│   ├── authentication/       # Login, registration templates
│   ├── home/                  # Home page templates
│   ├── restaurant/            # Restaurant templates
│   ├── order/                 # Cart and order templates
│   ├── rider/                 # Rider dashboard templates
│   └── kits/                  # Base templates and components
│
├── 📁 static/                 # Static files
│   ├── css/                   # Custom stylesheets
│   ├── js/                    # JavaScript files (AJAX, interactions)
│   └── img/                   # Static images
│
├── 📁 media/                  # User uploaded files
│   ├── restaurant_images/     # Restaurant photos
│   ├── menu_images/           # Food item images
│   ├── chef_images/           # Chef photos
│   └── profile_images/        # User profile pictures
│
├── 📁 tastecart/              # Django project settings
│   ├── settings.py            # Project configuration
│   ├── urls.py                # Main URL configuration
│   ├── wsgi.py                # WSGI configuration
│   └── asgi.py                # ASGI configuration
│
├── manage.py                  # Django management script
├── requirements.txt           # Python dependencies
├── db.sqlite3                 # Database file
└── README.md                  # Project documentation
```

## 🚀 Installation & Setup

### Prerequisites
- Python 3.8+
- pip (Python package manager)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Walid5054/tastecart.git
cd tastecart
```

### 2. Create Virtual Environment
```bash
# Windows
python -m venv myenv
myenv\Scripts\activate

# macOS/Linux
python3 -m venv myenv
source myenv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Database Setup
```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create Superuser
```bash
python manage.py createsuperuser
```

### 6. Run Development Server
```bash
python manage.py runserver
```

Visit `http://127.0.0.1:8000` to access the application.

## 📊 Database Models

### User Model (Custom)
- **Fields**: name, email, phone, user_type (user/owner/rider), city, restaurant_name
- **User Types**: Regular User, Restaurant Owner, Delivery Rider
- **Authentication**: Email-based login system

### Restaurant Model
- **Restaurant Information**: name, category, location, contact details
- **Business Details**: opening hours, delivery time, ratings
- **Media**: restaurant images, chef photos, interior images
- **Status**: open/closed, availability

### Menu Model
- **Item Details**: name, description, price, category
- **Availability**: in-stock status, estimated delivery time
- **Media**: food item images
- **Pricing**: base price, discounts, ratings

### Order System
- **Cart**: User cart management with quantity and totals
- **Order**: Order processing with status tracking
- **Payment**: Multiple payment methods (COD, Online)
- **Status Tracking**: Pending → Preparing → Completed → Delivered

## 🔧 Key Features Implementation

### Real-time Cart Management
- AJAX-powered cart operations
- Instant quantity updates
- Dynamic price calculations
- Cross-browser compatibility

### Order Tracking System
- Multi-stage order status
- Real-time notifications
- Restaurant owner acceptance
- Rider assignment and tracking

### User Role Management
- Custom user model with role-based permissions
- Decorator-based access control
- Separate dashboards for each user type
- Profile management for different roles

### Restaurant Management
- Complete restaurant profile setup
- Menu item management with categories
- Order queue management
- Business analytics and reporting

## 🔐 Security Features

- **CSRF Protection**: All forms protected against CSRF attacks
- **User Authentication**: Secure session-based authentication
- **Permission Decorators**: Role-based access control
- **Input Validation**: Server-side validation for all inputs
- **File Upload Security**: Safe handling of image uploads

## 🌐 API Endpoints

### Authentication
- `POST /login/` - User login
- `POST /register/` - User registration
- `POST /logout/` - User logout

### Cart & Orders
- `POST /add-to-cart/<slug>/<item_id>/` - Add item to cart
- `POST /update-cart-quantity/` - Update cart item quantity
- `POST /remove-from-cart/` - Remove item from cart
- `POST /checkout/<user_id>/` - Process order

### Restaurant Management
- `GET /restaurant/<slug>/` - Restaurant details
- `GET /restaurants/` - Restaurant listing
- `POST /restaurant/settings/` - Update restaurant

## 📱 Responsive Design

- **Mobile-First Approach**: Optimized for mobile devices
- **TailwindCSS Framework**: Modern utility-first CSS
- **Cross-Browser Support**: Compatible with all modern browsers
- **Progressive Enhancement**: Works without JavaScript

## 🔄 Workflow Process

### Customer Journey
1. **Registration/Login** → Account creation or authentication
2. **Browse Restaurants** → Discover restaurants by location/category
3. **View Menu** → Browse menu items and add to cart
4. **Cart Management** → Review and modify cart items
5. **Checkout** → Place order with payment method selection
6. **Order Tracking** → Monitor order status in real-time
7. **Delivery** → Receive order and provide feedback

### Restaurant Owner Journey
1. **Owner Registration** → Create restaurant owner account
2. **Restaurant Setup** → Complete restaurant profile and details
3. **Menu Management** → Add and manage menu items
4. **Order Processing** → Accept/reject incoming orders
5. **Order Fulfillment** → Prepare orders and update status
6. **Analytics** → View business performance metrics

### Rider Journey
1. **Rider Registration** → Create delivery rider account
2. **Profile Setup** → Complete rider profile and details
3. **Order Assignment** → Accept delivery requests
4. **Pickup & Delivery** → Collect and deliver orders
5. **Status Updates** → Update delivery progress
6. **Completion** → Mark deliveries as completed

## 👥 Collaborators

This project is developed and maintained by:

- **[Walid5054](https://github.com/Walid5054)** - Frontend Developer
  - Email: walid49161@gmail.com
  - Role: Full-stack development, project architecture

- **[AbrarZaved](https://github.com/AbrarZaved)** - Project Lead & Backend Developer
  - Email: abrarzaved2002@gmail.com
  - Role: UI/UX design, frontend implementation

- **[alamin5202](https://github.com/alamin5202)** - Frontend Developer  
  - Email: amin15-5202@diu.edu.bd
  - Role: Backend development, database design

- **[siddika221](https://github.com/siddika221)** - Jr Backend Developer
  - Email: nury15-5978@diu.edu.bd
  - Role: Feature development, testing

## 🤝 Contributing

We welcome contributions to TasteCart! Please follow these steps:

1. **Fork the Repository**
   ```bash
   git fork https://github.com/Walid5054/tastecart.git
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**
   - Follow Django best practices
   - Ensure code quality and documentation
   - Add tests for new features

4. **Commit Changes**
   ```bash
   git commit -m "Add: your feature description"
   ```

5. **Push to Branch**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Provide detailed description
   - Include screenshots if applicable
   - Reference related issues

## 📋 TODO / Roadmap

### Upcoming Features
- [ ] **Payment Gateway Integration** (Stripe, PayPal, bKash)
- [ ] **Real-time Chat Support** between customers and restaurants
- [ ] **GPS Tracking** for delivery riders
- [ ] **Mobile App Development** (React Native/Flutter)
- [ ] **Advanced Analytics Dashboard** for restaurant owners
- [ ] **Multi-language Support** (Bengali, English)
- [ ] **Social Media Integration** for sharing and reviews
- [ ] **Loyalty Program** and reward points system

### Performance Improvements
- [ ] **Redis Caching** for better performance
- [ ] **CDN Integration** for static file delivery
- [ ] **Database Optimization** and query optimization
- [ ] **API Rate Limiting** for security
- [ ] **Automated Testing** suite expansion

## 🐛 Known Issues

- Cart persistence across browser sessions needs improvement
- Image optimization for faster loading
- Email notification system needs SMTP configuration
- Search functionality can be enhanced with Elasticsearch

## 📞 Support & Contact

For support, feature requests, or bug reports:

- **Email**: tastecartworld@email.com
- **GitHub Issues**: [Create an issue](https://github.com/Walid5054/tastecart/issues)
- **Documentation**: Check this README and inline code comments

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Django Framework** for the robust backend foundation
- **TailwindCSS** for the beautiful and responsive UI
- **Unsplash** for high-quality stock images
- **Font Awesome** for the icon library
- **All Contributors** who made this project possible

## 📈 Project Statistics

- **Total Lines of Code**: ~15,000+
- **Database Tables**: 8 main models
- **Templates**: 25+ HTML templates
- **Static Files**: CSS, JS, and image assets
- **Development Time**: 6+ months
- **Team Size**: 4 developers

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ by the TasteCart Team

[🐛 Report Bug](https://github.com/Walid5054/tastecart/issues)

</div>
