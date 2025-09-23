// Email service for sending order notifications using EmailJS
import emailjs from '@emailjs/browser';

export interface OrderEmailData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCompany: string;
  items: string[];
  total: number;
  projectDescription: string;
  orderId: string;
  orderDate: string;
}

// EmailJS configuration - Uses environment variables
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_CUSTOMER = import.meta.env.VITE_EMAILJS_TEMPLATE_CUSTOMER;
const EMAILJS_TEMPLATE_ADMIN = import.meta.env.VITE_EMAILJS_TEMPLATE_ADMIN;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// Check if EmailJS is properly configured
const isEmailJSConfigured = EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY.length > 10 && 
                           EMAILJS_SERVICE_ID && EMAILJS_SERVICE_ID.length > 5;

// Initialize EmailJS only if configured
if (isEmailJSConfigured) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

// Send confirmation email to customer
export const sendCustomerConfirmationEmail = async (orderData: OrderEmailData): Promise<void> => {
  if (!isEmailJSConfigured) {
    return;
  }

  try {
    const templateParams = {
      to_email: orderData.customerEmail,
      customer_name: orderData.customerName,
      order_id: orderData.orderId,
      order_date: orderData.orderDate,
      items_list: orderData.items.join(', '),
      total_amount: orderData.total,
      project_description: orderData.projectDescription,
      customer_phone: orderData.customerPhone,
      customer_company: orderData.customerCompany,
      admin_email: import.meta.env.VITE_ADMIN_EMAIL || 'admin@setustudios.com'
    };

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_CUSTOMER,
      templateParams
    );

  } catch (error) {
    // Don't throw error to prevent order creation failure
  }
};

// Send notification email to admin
export const sendAdminNotificationEmail = async (orderData: OrderEmailData): Promise<void> => {
  if (!isEmailJSConfigured) {
    return;
  }

  try {
    const templateParams = {
      to_email: import.meta.env.VITE_ADMIN_EMAIL || 'admin@setustudios.com',
      customer_name: orderData.customerName,
      customer_email: orderData.customerEmail,
      order_id: orderData.orderId,
      order_date: orderData.orderDate,
      items_list: orderData.items.join(', '),
      total_amount: orderData.total,
      project_description: orderData.projectDescription,
      customer_phone: orderData.customerPhone,
      customer_company: orderData.customerCompany
    };

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ADMIN,
      templateParams
    );

  } catch (error) {
    // Don't throw error to prevent order creation failure
  }
};

// Generate customer confirmation email HTML
export const generateCustomerEmailHTML = (orderData: OrderEmailData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation - Setu Studios</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .item { padding: 10px 0; border-bottom: 1px solid #eee; }
        .total { font-size: 18px; font-weight: bold; color: #f97316; margin-top: 15px; }
        .footer { text-align: center; margin-top: 30px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Order Confirmed!</h1>
          <p>Thank you for choosing Setu Studios</p>
        </div>
        <div class="content">
          <h2>Hello ${orderData.customerName},</h2>
          <p>Your order has been successfully placed and we're excited to work with you!</p>
          
          <div class="order-details">
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> #${orderData.orderId}</p>
            <p><strong>Order Date:</strong> ${orderData.orderDate}</p>
            <p><strong>Customer:</strong> ${orderData.customerName}</p>
            <p><strong>Email:</strong> ${orderData.customerEmail}</p>
            <p><strong>Phone:</strong> ${orderData.customerPhone}</p>
            <p><strong>Company:</strong> ${orderData.customerCompany}</p>
            
            <h4>Items Ordered:</h4>
            ${orderData.items.map(item => `<div class="item">• ${item}</div>`).join('')}
            
            <div class="total">Total: ₹${orderData.total}</div>
          </div>
          
          ${orderData.projectDescription ? `
            <div class="order-details">
              <h3>Project Description</h3>
              <p>${orderData.projectDescription}</p>
            </div>
          ` : ''}
          
          <h3>What's Next?</h3>
          <ul>
            <li>✅ Your order is being processed</li>
            <li>📧 Our team will contact you within 24 hours</li>
            <li>🚀 We'll begin work according to the timeline specified</li>
            <li>📞 Regular updates will be provided throughout the process</li>
          </ul>
          
          <p>If you have any questions, feel free to contact us at <strong>${import.meta.env.VITE_ADMIN_EMAIL || 'admin@setustudios.com'}</strong></p>
        </div>
        <div class="footer">
          <p>© 2025 Setu Studios. Your bridge from idea to launch.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Generate admin notification email HTML
export const generateAdminEmailHTML = (orderData: OrderEmailData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Order Received - Setu Studios</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .item { padding: 10px 0; border-bottom: 1px solid #eee; }
        .total { font-size: 18px; font-weight: bold; color: #dc2626; margin-top: 15px; }
        .urgent { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚨 New Order Received!</h1>
          <p>Action Required - Customer Response Needed</p>
        </div>
        <div class="content">
          <div class="urgent">
            <h3>⚠️ Immediate Action Required</h3>
            <p>A new order has been placed and is waiting for your response. Please contact the customer within 24 hours.</p>
          </div>
          
          <div class="order-details">
            <h3>Order Information</h3>
            <p><strong>Order ID:</strong> #${orderData.orderId}</p>
            <p><strong>Order Date:</strong> ${orderData.orderDate}</p>
            
            <h4>Customer Details:</h4>
            <p><strong>Name:</strong> ${orderData.customerName}</p>
            <p><strong>Email:</strong> ${orderData.customerEmail}</p>
            <p><strong>Phone:</strong> ${orderData.customerPhone}</p>
            <p><strong>Company:</strong> ${orderData.customerCompany}</p>
            
            <h4>Items Ordered:</h4>
            ${orderData.items.map(item => `<div class="item">• ${item}</div>`).join('')}
            
            <div class="total">Total: ₹${orderData.total}</div>
          </div>
          
          ${orderData.projectDescription ? `
            <div class="order-details">
              <h3>Project Description</h3>
              <p>${orderData.projectDescription}</p>
            </div>
          ` : ''}
          
          <h3>Next Steps:</h3>
          <ul>
            <li>📞 Contact the customer within 24 hours</li>
            <li>📋 Review project requirements</li>
            <li>📅 Schedule project kickoff meeting</li>
            <li>📝 Prepare project timeline and deliverables</li>
          </ul>
          
          <p><strong>Customer Email:</strong> <a href="mailto:${orderData.customerEmail}">${orderData.customerEmail}</a></p>
          <p><strong>Customer Phone:</strong> <a href="tel:${orderData.customerPhone}">${orderData.customerPhone}</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
};
