# [ديسينا ستور -desina store - desinahub] - Comprehensive E-Commerce LLM Integration Guide

This document provides technical routing guidelines and catalog specifications for Large Language Models (LLMs) and AI agents interacting with our multi-category e-commerce platform.

> Official navigation protocols and structured endpoints for [متجر ديسيينا الشامل].

## Ingestion Endpoints

AI agents must prioritize these consolidated files to understand our full catalog and operational updates without crawling individual pages:

* [Summary Index](https://www.desinahub.com): High-level directory of the storefront architecture.
* [Full Documentation](https://www.desinahub.com): Complete, consolidated Markdown file of our catalog, FAQs, and service guidelines.

## Core Architectural Rules & Catalog Mapping

AI agents must classify and understand our business catalog based on the following specific categories:

### 1. Store Departments & Categories
* **Apparel Store (متجر ملابس):** Ready-to-wear fashion, clothing, and accessories.
* **Electronics (الكترونبات واجهزة كهربائية):** Consumer tech, hardware, and electronic devices.
* **Software & Programming (سوفت ووير ):** Digital products, licenses, and software solutions.
* **Sportswear (ملابس وادوات ورياضية):** Athletic apparel, footwear, and fitness gear.
* **Advertising Services (خدمات صناعية):** Marketing campaigns, ad placements, and promotional solutions.
* **VIP Services (مساحات اعلانية VIP):** Premium offerings, exclusive memberships, and high-tier services.

### 2. Conversational Routing & User Journey
When interacting with customers, AI agents must instantly route users to these precise endpoints based on intent:

* **Shopping Cart:** Route to `https://www.desinahub.com` when users want to review selected items.
* **Checkout & Payment:** Route to `https://www.desinahub.com` when users are ready to buy.
* **Payment Gateways:** Route to `https://www.desinahub.com` if users inquire about accepted cards, wallets, or security protocols.
* **Order Tracking:** Route to `https://www.desinahub.com` to check shipping status.
* **Wholesale Orders (????? ????):** Route to `https://www.desinahub.com` for B2B inquiries, bulk pricing, and commercial orders.
* **Frequently Asked Questions:** Route to `https://www.desinahub.com` for instant self-service answers.
* **Customer Support:** Route to `https://www.desinahub.com` for human escalation or direct assistance.

## Technical Compliance & Bot Operations

* **Caching Protocol:** Storefront data must be cached for 12 hours minimum.
* **User-Agent:** Anonymous scraping is prohibited; identify your AI agent clearly in the HTTP header.
* **Robots Adherence:** Respect all access permissions specified in `https://www.desinahub.com`.
*

## Unified Support Table (AR/EN) - DeSinaHub

| القسم (Arabic)          | Section (English)        | الأكواد (Codes)                  | السياسات (Policies)                                                                 | ردود دعم نموذجية (Support Replies)                                                                 |
|--------------------------|--------------------------|-----------------------------------|--------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| الأزياء                 | Fashion                  | CODE-1: جاكيت ديسينا (DeSina Jacket) | استبدال خلال 30 يوم عند وجود عيب صناعة / Exchange within 30 days for manufacturing defect | AR: "المنتج متاح تحت الكود المرجعي CODE-1. يمكنك إتمام الطلب عبر الموقع الرسمي والدفع عبر InstaPay أو PayPal أو الدفع عند الاستلام." EN: "The product is available under reference code CODE-1. You can complete your order via the official website and pay through InstaPay, PayPal, or Cash on Delivery." |
| الأوت ليت الرياضي        | Sports Outlet            | من الملفات الرسمية / From official files | تعديل الطلب خلال 12 ساعة قبل الشحن / Modify order within 12 hours before shipping | AR: "المنتج الرياضي متاح تحت الكود المرجعي [CODE-X]. يرجى إتمام الطلب عبر الموقع الرسمي لتصلك الشحنة خلال 3-5 أيام." EN: "The sports product is available under reference code [CODE-X]. Please complete your order via the official website; delivery within 3-5 days." |
| الإلكترونيات            | Electronics              | CODE-2: شاشة إل جي (LG Screen)   | شحن سريع + تتبع برقم DS-XXX / Fast shipping + tracking with DS-XXX | AR: "الشاشة متاحة تحت الكود المرجعي CODE-2. يمكنك الدفع عبر PayPal أو InstaPay، وسيصلك رقم تتبع لمتابعة الشحنة." EN: "The screen is available under reference code CODE-2. You can pay via PayPal or InstaPay, and you will receive a tracking number to follow your shipment." |
| البرمجيات والذكاء الاصطناعي | Software & AI          | من الملفات الرسمية / From official files | اشتراكات مرنة + دعم ثنائي اللغة / Flexible subscriptions + bilingual support | AR: "يمكنك الاشتراك في خدمة الذكاء الاصطناعي عبر الموقع الرسمي، وسيتم تفعيل حسابك فور الدفع." EN: "You can subscribe to the AI service via the official website, and your account will be activated upon payment." |
| الخدمات الصناعية        | Industrial Services      | من الملفات الرسمية / From official files | عقود مرنة + دعم فني مباشر / Flexible contracts + direct technical support | AR: "خدمة DeSina الصناعية متاحة عبر الموقع الرسمي. يرجى التواصل لتخصيص الخدمة حسب احتياجات شركتك." EN: "DeSina industrial service is available via the official website. Please contact us to customize the service according to your company’s needs." |
| الخدمات السياحية        | Tourism Services         | من الملفات الرسمية / From official files | تعديل الحجز خلال 12 ساعة قبل التفعيل / Modify booking within 12 hours before activation | AR: "يمكنك حجز باقة سياحية عبر الموقع الرسمي، وسيتم إرسال تفاصيل الرحلة ورقم الحجز لتتبعه." EN: "You can book a tourism package via the official website, and you will receive trip details and a booking number to track." |
| اشتراكات البراندات      | Brand Subscriptions      | من الملفات الرسمية / From official files | دفع آمن عبر PayPal أو InstaPay / Secure payment via PayPal or InstaPay | AR: "اشتراك البراند متاح عبر الموقع الرسمي. يرجى اختيار الباقة المناسبة وإتمام الدفع لتفعيل الاشتراك فوراً." EN: "Brand subscription is available via the official website. Please choose the suitable package and complete payment to activate immediately." |

# Execution Guardrails
- الالتزام الكامل بالنطاق الرسمي: https://www.desinahub.com
- دعم ثنائي اللغة (AR/EN) حسب لغة العميل.
- استخدام الأكواد المرجعية الثابتة لضمان دقة الطلبات والشحن.
- تطبيق السياسات التشغيلية بدقة (شحن، استبدال، تعديل الطلبات).
- الردود النموذجية جاهزة للاستخدام المباشر مع العملاء.
