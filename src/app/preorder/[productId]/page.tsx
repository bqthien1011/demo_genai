"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { useProductContext } from "@/lib/context/ProductContext";

export default function PreorderPage() {
  const params = useParams();
  const productId = params.productId as string;
  const { aiProducts, suggestedProducts, customizedImages } =
    useProductContext();

  // Find product from AI products or suggested products
  const product =
    aiProducts.find((p) => p.id === productId) ||
    suggestedProducts.find((p) => p.id === productId);

  // Get customized image if available
  const displayImage =
    customizedImages.get(productId) ||
    product?.imageUrl ||
    product?.image ||
    "/placeholder.svg";

  // Form state
  const [quantity, setQuantity] = useState(1);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    birthDate: "",
    notifications: true,
  });
  const [shipping, setShipping] = useState({
    method: "delivery" as "delivery" | "pickup",
    address: {
      province: "Thành phố Hồ Chí Minh",
      district: "",
      ward: "",
      street: "",
    },
    storeId: "",
  });
  const [payment, setPayment] = useState({
    method: "bank_transfer" as const,
  });
  const [promotions, setPromotions] = useState({
    discountCode: "",
    appliedOffers: [] as string[],
    discountAmount: 0,
  });
  const [isPolicyExpanded, setIsPolicyExpanded] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [fieldValidation, setFieldValidation] = useState<
    Record<string, "idle" | "valid" | "invalid">
  >({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Mock data for HCM locations and stores
  const hcmDistricts = [
    "Quận 1",
    "Quận 3",
    "Quận 4",
    "Quận 5",
    "Quận 6",
    "Quận 7",
    "Quận 8",
    "Quận 10",
    "Quận 11",
    "Quận 12",
    "Quận Bình Thạnh",
    "Quận Bình Tân",
    "Quận Gò Vấp",
    "Quận Phú Nhuận",
    "Quận Tân Bình",
    "Quận Tân Phú",
    "Huyện Bình Chánh",
    "Huyện Cần Giờ",
    "Huyện Củ Chi",
    "Huyện Hóc Môn",
    "Huyện Nhà Bè",
  ];

  const hcmWards: Record<string, string[]> = {
    "Quận 1": [
      "Bến Nghé",
      "Bến Thành",
      "Cô Giang",
      "Cầu Kho",
      "Cầu Ông Lãnh",
      "Đa Kao",
      "Nguyễn Cư Trinh",
      "Nguyễn Thái Bình",
      "Tân Định",
      "Thạnh Xuân",
    ],
    "Quận 3": [
      "Phường 1",
      "Phường 2",
      "Phường 3",
      "Phường 4",
      "Phường 5",
      "Phường 6",
      "Phường 7",
      "Phường 8",
      "Phường 9",
      "Phường 10",
      "Phường 11",
      "Phường 12",
      "Phường 13",
      "Phường 14",
    ],
    "Quận 7": [
      "Phường Bình Thuận",
      "Phường Phú Mỹ",
      "Phường Phú Thuận",
      "Phường Tân Hưng",
      "Phường Tân Kiểng",
      "Phường Tân Phong",
      "Phường Tân Phú",
      "Phường Tân Quy",
      "Phường Tân Thuận Đông",
      "Phường Tân Thuận Tây",
    ],
  };

  const pnjStores = [
    {
      id: "pnj_diamond_plaza",
      name: "PNJ Diamond Plaza",
      address: "Lô T2-03, Tầng Trệt, TTTM Diamond Plaza, 34 Lê Duẩn, Quận 1",
      district: "Quận 1",
    },
    {
      id: "pnj_paragon",
      name: "PNJ Paragon",
      address: "Tầng 1, TTTM Paragon, 3 Nguyễn Lương Bằng, Quận 7",
      district: "Quận 7",
    },
    {
      id: "pnj_go_vap",
      name: "PNJ Gò Vấp",
      address: "456 Quang Trung, Phường 10, Gò Vấp",
      district: "Gò Vấp",
    },
    {
      id: "pnj_tan_binh",
      name: "PNJ Tân Bình",
      address: "123 Cách Mạng Tháng 8, Phường 10, Tân Bình",
      district: "Quận Tân Bình",
    },
    {
      id: "pnj_binh_thanh",
      name: "PNJ Bình Thạnh",
      address: "789 Xô Viết Nghệ Tĩnh, Phường 25, Bình Thạnh",
      district: "Quận Bình Thạnh",
    },
  ];

  // Mock promotion codes
  const validPromoCodes = {
    PREORDER10: { discount: 10, description: "Giảm 10% cho đơn preorder" },
    WELCOME5: { discount: 5, description: "Giảm 5% cho khách hàng mới" },
    PNJ20: { discount: 20, description: "Giảm 20% cho sản phẩm PNJ" },
  };

  // Form validation
  const validateCustomerInfo = () => {
    const errors: Record<string, string> = {};

    if (!customerInfo.name.trim()) {
      errors.name = "Vui lòng nhập họ và tên";
    }

    if (!customerInfo.phone.trim()) {
      errors.phone = "Vui lòng nhập số điện thoại";
    } else if (
      !/^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/.test(
        customerInfo.phone.replace(/\s/g, "")
      )
    ) {
      errors.phone = "Số điện thoại không hợp lệ";
    }

    if (!customerInfo.email.trim()) {
      errors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      errors.email = "Email không hợp lệ";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCustomerInfoChange = (field: string, value: string | boolean) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));

    // Real-time validation for customer fields
    if (field === "name") {
      const isValid = value.toString().trim().length > 0;
      setFieldValidation((prev) => ({
        ...prev,
        [field]: isValid
          ? "valid"
          : value.toString().trim()
          ? "invalid"
          : "idle",
      }));
      setFormErrors((prev) => ({
        ...prev,
        [field]: isValid
          ? ""
          : value.toString().trim()
          ? "Vui lòng nhập họ và tên"
          : "",
      }));
    } else if (field === "phone") {
      const phoneValue = value.toString().replace(/\s/g, "");
      const isValidFormat = /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/.test(phoneValue);
      const hasValue = phoneValue.length > 0;
      setFieldValidation((prev) => ({
        ...prev,
        [field]: hasValue ? (isValidFormat ? "valid" : "invalid") : "idle",
      }));
      setFormErrors((prev) => ({
        ...prev,
        [field]: hasValue && !isValidFormat ? "Số điện thoại không hợp lệ" : "",
      }));
    } else if (field === "email") {
      const emailValue = value.toString();
      const isValidFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
      const hasValue = emailValue.length > 0;
      setFieldValidation((prev) => ({
        ...prev,
        [field]: hasValue ? (isValidFormat ? "valid" : "invalid") : "idle",
      }));
      setFormErrors((prev) => ({
        ...prev,
        [field]: hasValue && !isValidFormat ? "Email không hợp lệ" : "",
      }));
    }
  };

  const handleShippingChange = (field: string, value: string) => {
    if (field === "method") {
      setShipping((prev) => ({
        ...prev,
        method: value as "delivery" | "pickup",
      }));
      // Clear validation when switching methods
      setFieldValidation((prev) => ({
        ...prev,
        district: "idle",
        ward: "idle",
        street: "idle",
        store: "idle",
      }));
      setFormErrors((prev) => ({
        ...prev,
        district: "",
        ward: "",
        street: "",
        store: "",
      }));
    } else if (field.startsWith("address.")) {
      const addressField = field.split(".")[1];
      setShipping((prev) => ({
        ...prev,
        address: { ...prev.address, [addressField]: value },
      }));

      // Real-time validation for address fields
      if (addressField === "district" || addressField === "ward") {
        const isValid = value.length > 0;
        setFieldValidation((prev) => ({
          ...prev,
          [addressField]: isValid ? "valid" : "idle",
        }));
        setFormErrors((prev) => ({ ...prev, [addressField]: "" }));
      } else if (addressField === "street") {
        const isValid = value.trim().length > 0;
        setFieldValidation((prev) => ({
          ...prev,
          [addressField]: isValid ? "valid" : value.trim() ? "invalid" : "idle",
        }));
        setFormErrors((prev) => ({
          ...prev,
          [addressField]: isValid
            ? ""
            : value.trim()
            ? "Vui lòng nhập địa chỉ cụ thể"
            : "",
        }));
      }
    } else if (field === "storeId") {
      setShipping((prev) => ({ ...prev, storeId: value }));
      const isValid = value.length > 0;
      setFieldValidation((prev) => ({
        ...prev,
        store: isValid ? "valid" : "idle",
      }));
      setFormErrors((prev) => ({ ...prev, store: "" }));
    }
  };

  const handlePaymentChange = (method: "bank_transfer") => {
    setPayment({ method });
  };

  const handlePromoCodeApply = () => {
    const code = promotions.discountCode.trim().toUpperCase();
    if (!code) return;

    const promo = validPromoCodes[code as keyof typeof validPromoCodes];
    if (promo) {
      const discountAmount = Math.round(
        ((product?.price || 0) * promo.discount) / 100
      );

      setPromotions((prev) => ({
        ...prev,
        appliedOffers: [
          ...prev.appliedOffers.filter((offer) => !offer.includes("Giảm")),
          `${promo.description} (${promo.discount}%)`,
        ],
        discountAmount,
      }));
      setFormErrors((prev) => ({ ...prev, promoCode: "" }));
    } else {
      setFormErrors((prev) => ({
        ...prev,
        promoCode: "Mã giảm giá không hợp lệ",
      }));
    }
  };

  const handlePromoCodeRemove = (index: number) => {
    setPromotions((prev) => ({
      ...prev,
      appliedOffers: prev.appliedOffers.filter((_, i) => i !== index),
      discountAmount:
        prev.appliedOffers.length > 1
          ? Math.round((product?.price || 0) * 0.1)
          : 0, // Simplified recalculation
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Customer validation
    if (!customerInfo.name.trim()) {
      errors.name = "Vui lòng nhập họ và tên";
    }
    if (!customerInfo.phone.trim()) {
      errors.phone = "Vui lòng nhập số điện thoại";
    } else if (
      !/^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/.test(
        customerInfo.phone.replace(/\s/g, "")
      )
    ) {
      errors.phone = "Số điện thoại không hợp lệ";
    }
    if (!customerInfo.email.trim()) {
      errors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      errors.email = "Email không hợp lệ";
    }

    // Shipping validation
    if (shipping.method === "delivery") {
      if (!shipping.address.district) {
        errors.district = "Vui lòng chọn quận/huyện";
      }
      if (!shipping.address.ward) {
        errors.ward = "Vui lòng chọn phường/xã";
      }
      if (!shipping.address.street.trim()) {
        errors.street = "Vui lòng nhập địa chỉ cụ thể";
      }
    } else if (shipping.method === "pickup") {
      if (!shipping.storeId) {
        errors.store = "Vui lòng chọn cửa hàng nhận hàng";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      // Scroll to first error
      const firstError = Object.keys(formErrors)[0];
      const errorElement = document.getElementById(firstError);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Mock API call - simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate mock order ID
      const generatedOrderId = `PRE-${Date.now()}`;
      setOrderId(generatedOrderId);
      setSubmitStatus("success");

      // Log the complete order data for debugging
      console.log("Preorder submitted:", {
        productId,
        quantity,
        customerInfo,
        shipping,
        payment,
        promotions,
        orderNotes,
        orderId: generatedOrderId,
      });
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  if (submitStatus === "success" && orderId) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              {/* Success Message - Full Page */}
              <div className="text-center">
                <div className="mb-8">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    Đặt hàng thành công!
                  </h1>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6 sm:p-8 max-w-2xl mx-auto">
                  <div className="space-y-4 text-left">
                    <div className="flex items-center justify-center mb-6">
                      <div className="text-center">
                        <p className="text-lg font-semibold text-green-800 mb-2">
                          Mã đơn hàng của bạn:
                        </p>
                        <p className="text-2xl sm:text-3xl font-bold text-green-900 bg-white px-4 py-2 rounded border-2 border-green-300 inline-block">
                          {orderId}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm sm:text-base text-green-700">
                      <p className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ để xác
                        nhận đơn hàng.
                      </p>
                      <p className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        Email xác nhận đã được gửi đến:{" "}
                        <strong className="text-green-900">
                          {customerInfo.email}
                        </strong>
                      </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-green-200">
                      <div className="text-center">
                        <p className="text-sm text-green-600 mb-4">
                          Cảm ơn bạn đã tin tưởng và lựa chọn PNJ!
                        </p>
                        <button
                          onClick={() => (window.location.href = "/")}
                          className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                        >
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                          </svg>
                          Về trang chủ
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-6 sm:mb-8">
              Đặt trước sản phẩm
            </h1>

            {/* Product Info Section */}
            <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gray-50 rounded-lg">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                🛍️ Thông tin sản phẩm đặt trước
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Product Image */}
                <div className="flex justify-center">
                  <div className="relative w-full max-w-sm h-48 sm:h-64 bg-white rounded-lg overflow-hidden shadow-md">
                    <Image
                      src={displayImage}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-4">
                  {/* Product Name */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Mã sản phẩm: {product.id}
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mô tả sản phẩm
                    </label>
                    <p className="text-sm text-gray-600 bg-white p-3 rounded border">
                      {product.description}
                    </p>
                    {product.aiDescription && (
                      <p className="text-xs text-gray-500 mt-2 italic">
                        * Sản phẩm được tạo bởi AI dựa trên ý tưởng:{" "}
                        {product.aiDescription}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-semibold text-gray-900">
                      Giá dự kiến: {product.price.toLocaleString("vi-VN")} VND
                    </span>
                    <div className="group relative">
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Giá có thể thay đổi khi sản phẩm chính thức ra mắt
                      </div>
                    </div>
                  </div>

                  {/* Release Date */}
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm text-gray-600">
                      Thời gian phát hành dự kiến: Tháng 12, 2025
                    </span>
                  </div>

                  {/* Quantity Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số lượng đặt
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 sm:w-8 sm:h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 touch-manipulation"
                      >
                        <span className="text-lg font-medium">-</span>
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(
                            Math.max(
                              1,
                              Math.min(10, parseInt(e.target.value) || 1)
                            )
                          )
                        }
                        className="w-16 sm:w-16 text-center border border-gray-300 rounded px-2 py-2 sm:py-1 text-base"
                      />
                      <button
                        onClick={() => setQuantity(Math.min(10, quantity + 1))}
                        className="w-10 h-10 sm:w-8 sm:h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 touch-manipulation"
                      >
                        <span className="text-lg font-medium">+</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Info Section */}
            <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gray-50 rounded-lg">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                👤 Thông tin khách hàng
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) =>
                        handleCustomerInfoChange("name", e.target.value)
                      }
                      className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.name
                          ? "border-red-500"
                          : fieldValidation.name === "valid"
                          ? "border-green-500"
                          : fieldValidation.name === "invalid"
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Nhập họ và tên đầy đủ"
                    />
                    {fieldValidation.name === "valid" && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg
                          className="h-5 w-5 text-green-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                    {fieldValidation.name === "invalid" && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg
                          className="h-5 w-5 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="phone"
                      value={customerInfo.phone}
                      onChange={(e) =>
                        handleCustomerInfoChange("phone", e.target.value)
                      }
                      className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.phone
                          ? "border-red-500"
                          : fieldValidation.phone === "valid"
                          ? "border-green-500"
                          : fieldValidation.phone === "invalid"
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Ví dụ: 0901234567"
                    />
                    {fieldValidation.phone === "valid" && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg
                          className="h-5 w-5 text-green-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                    {fieldValidation.phone === "invalid" && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg
                          className="h-5 w-5 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  {formErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      value={customerInfo.email}
                      onChange={(e) =>
                        handleCustomerInfoChange("email", e.target.value)
                      }
                      className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.email
                          ? "border-red-500"
                          : fieldValidation.email === "valid"
                          ? "border-green-500"
                          : fieldValidation.email === "invalid"
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="example@email.com"
                    />
                    {fieldValidation.email === "valid" && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg
                          className="h-5 w-5 text-green-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                    {fieldValidation.email === "invalid" && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg
                          className="h-5 w-5 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                {/* Birth Date */}
                <div>
                  <label
                    htmlFor="birthDate"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    id="birthDate"
                    value={customerInfo.birthDate}
                    onChange={(e) =>
                      handleCustomerInfoChange("birthDate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Notification Preference */}
              <div className="mt-4 sm:mt-6">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="notifications"
                    checked={customerInfo.notifications}
                    onChange={(e) =>
                      handleCustomerInfoChange(
                        "notifications",
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                  />
                  <label
                    htmlFor="notifications"
                    className="ml-3 block text-sm text-gray-700 cursor-pointer"
                  >
                    Tôi muốn nhận thông báo khi sản phẩm phát hành
                  </label>
                </div>
                <p className="mt-2 text-xs text-gray-500 ml-7">
                  Bạn sẽ nhận được email thông báo về tiến độ sản xuất và ngày
                  phát hành dự kiến.
                </p>
              </div>
            </div>

            {/* Shipping Section */}
            <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gray-50 rounded-lg">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                🚚 Hình thức nhận hàng
              </h2>

              {/* Shipping Method Selection */}
              <div className="mb-4 sm:mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Delivery Option */}
                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      shipping.method === "delivery"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleShippingChange("method", "delivery")}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <svg
                          className={`h-6 w-6 ${
                            shipping.method === "delivery"
                              ? "text-blue-600"
                              : "text-gray-400"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <input
                            type="radio"
                            id="delivery"
                            name="shippingMethod"
                            value="delivery"
                            checked={shipping.method === "delivery"}
                            onChange={(e) =>
                              handleShippingChange("method", e.target.value)
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <label
                            htmlFor="delivery"
                            className="ml-2 block text-sm font-medium text-gray-900 cursor-pointer"
                          >
                            Giao hàng tận nơi
                          </label>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          Miễn phí toàn quốc
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Pickup Option */}
                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      shipping.method === "pickup"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleShippingChange("method", "pickup")}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <svg
                          className={`h-6 w-6 ${
                            shipping.method === "pickup"
                              ? "text-blue-600"
                              : "text-gray-400"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <input
                            type="radio"
                            id="pickup"
                            name="shippingMethod"
                            value="pickup"
                            checked={shipping.method === "pickup"}
                            onChange={(e) =>
                              handleShippingChange("method", e.target.value)
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <label
                            htmlFor="pickup"
                            className="ml-2 block text-sm font-medium text-gray-900 cursor-pointer"
                          >
                            Nhận tại cửa hàng PNJ
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Address Form */}
              {shipping.method === "delivery" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Thông tin giao hàng
                  </h3>

                  {/* Province (HCM Only) */}
                  <div>
                    <label
                      htmlFor="province"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Tỉnh/Thành phố
                    </label>
                    <select
                      id="province"
                      value={shipping.address.province}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                    >
                      <option value="Thành phố Hồ Chí Minh">
                        Thành phố Hồ Chí Minh
                      </option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      Hiện tại chỉ hỗ trợ giao hàng tại TP.HCM
                    </p>
                  </div>

                  {/* District */}
                  <div>
                    <label
                      htmlFor="district"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Quận/Huyện <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="district"
                        value={shipping.address.district}
                        onChange={(e) =>
                          handleShippingChange(
                            "address.district",
                            e.target.value
                          )
                        }
                        className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          formErrors.district
                            ? "border-red-500"
                            : fieldValidation.district === "valid"
                            ? "border-green-500"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="">Chọn quận/huyện</option>
                        {hcmDistricts.map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                      </select>
                      {fieldValidation.district === "valid" && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg
                            className="h-5 w-5 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ward */}
                  {shipping.address.district && (
                    <div>
                      <label
                        htmlFor="ward"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Phường/Xã <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="ward"
                          value={shipping.address.ward}
                          onChange={(e) =>
                            handleShippingChange("address.ward", e.target.value)
                          }
                          className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            formErrors.ward
                              ? "border-red-500"
                              : fieldValidation.ward === "valid"
                              ? "border-green-500"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="">Chọn phường/xã</option>
                          {(hcmWards[shipping.address.district] || []).map(
                            (ward) => (
                              <option key={ward} value={ward}>
                                {ward}
                              </option>
                            )
                          )}
                        </select>
                        {fieldValidation.ward === "valid" && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <svg
                              className="h-5 w-5 text-green-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Street Address */}
                  <div>
                    <label
                      htmlFor="street"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Địa chỉ cụ thể <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="street"
                        value={shipping.address.street}
                        onChange={(e) =>
                          handleShippingChange("address.street", e.target.value)
                        }
                        className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          formErrors.street
                            ? "border-red-500"
                            : fieldValidation.street === "valid"
                            ? "border-green-500"
                            : fieldValidation.street === "invalid"
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Ví dụ: 123 Đường ABC, Phường XYZ"
                      />
                      {fieldValidation.street === "valid" && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <svg
                            className="h-5 w-5 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                      {fieldValidation.street === "invalid" && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <svg
                            className="h-5 w-5 text-red-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    {formErrors.street && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.street}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Store Selection */}
              {shipping.method === "pickup" && (
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900">
                    Chọn cửa hàng PNJ
                  </h3>

                  <div className="space-y-3">
                    {pnjStores.map((store) => (
                      <div
                        key={store.id}
                        className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-start">
                          <input
                            type="radio"
                            id={store.id}
                            name="store"
                            value={store.id}
                            checked={shipping.storeId === store.id}
                            onChange={(e) =>
                              handleShippingChange("storeId", e.target.value)
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 mt-1 flex-shrink-0"
                          />
                          <div className="ml-3 flex-1 min-w-0">
                            <label
                              htmlFor={store.id}
                              className="block text-sm font-medium text-gray-900 cursor-pointer mb-1"
                            >
                              {store.name}
                            </label>
                            <p className="text-sm text-gray-600 mb-1 break-words">
                              {store.address}
                            </p>
                            <p className="text-xs text-gray-500">
                              {store.district}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Payment Section */}
            <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gray-50 rounded-lg">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                💳 Phương thức thanh toán
              </h2>

              {/* Payment Method Selection */}
              <div className="mb-4 sm:mb-6">
                <div className="space-y-4">
                  {/* Bank Transfer */}
                  <div className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-start">
                      <input
                        type="radio"
                        id="bank_transfer"
                        name="paymentMethod"
                        value="bank_transfer"
                        checked={payment.method === "bank_transfer"}
                        onChange={() => handlePaymentChange("bank_transfer")}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 mt-1 flex-shrink-0"
                      />
                      <div className="ml-3 flex-1 min-w-0">
                        <label
                          htmlFor="bank_transfer"
                          className="block text-sm font-medium text-gray-900 cursor-pointer mb-2"
                        >
                          Chuyển khoản ngân hàng
                        </label>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p className="font-medium">Thông tin tài khoản:</p>
                          <p className="break-words">Ngân hàng: Vietcombank</p>
                          <p className="break-words">
                            Số tài khoản: 1234567890
                          </p>
                          <p className="break-words">
                            Chủ tài khoản: Công ty TNHH PNJ
                          </p>
                          <p className="break-words">
                            Nội dung: PRE-{product?.id} [Họ tên của bạn]
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Regulation Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-amber-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800">
                      Quy định thanh toán theo pháp luật
                    </h3>
                    <div className="mt-2 text-sm text-amber-700 space-y-2">
                      <p className="break-words">
                        Theo Nghị định 232/2025/NĐ-CP, Quý khách vui lòng thanh
                        toán qua tài khoản ngân hàng cho các giao dịch mua, bán,
                        đổi vàng từ 20 triệu đồng/ngày vào tài khoản Công ty.
                      </p>
                      <p className="break-words">
                        Khách hàng phải thanh toán bằng tài khoản ngân hàng
                        chính chủ, trùng khớp với thông tin người đặt hàng và
                        thông tin xuất hóa đơn.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preorder Payment Notes */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Lưu ý về thanh toán preorder
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <ul className="list-disc list-inside space-y-1">
                        <li className="break-words">
                          Đơn hàng pre-order cần thanh toán toàn bộ trước khi
                          sản xuất
                        </li>
                        <li className="break-words">
                          Sau khi thanh toán, PNJ sẽ xác nhận và bắt đầu sản
                          xuất
                        </li>
                        <li className="break-words">
                          Thời gian giao hàng dự kiến: 30-45 ngày kể từ ngày xác
                          nhận
                        </li>
                        <li className="break-words">
                          Không hỗ trợ hoàn tiền sau khi bắt đầu sản xuất
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Promotions Section */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                🎁 Ưu đãi & khuyến mãi
              </h2>

              {/* Discount Code Input */}
              <div className="mb-4 sm:mb-6">
                <label
                  htmlFor="discountCode"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Mã giảm giá
                </label>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <input
                    type="text"
                    id="discountCode"
                    value={promotions.discountCode}
                    onChange={(e) =>
                      setPromotions((prev) => ({
                        ...prev,
                        discountCode: e.target.value,
                      }))
                    }
                    className={`flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.promoCode
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Nhập mã giảm giá"
                    onKeyPress={(e) =>
                      e.key === "Enter" && handlePromoCodeApply()
                    }
                  />
                  <button
                    onClick={handlePromoCodeApply}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors whitespace-nowrap"
                  >
                    Áp dụng
                  </button>
                </div>
                {formErrors.promoCode && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.promoCode}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Ví dụ: PREORDER10, WELCOME5, PNJ20
                </p>
              </div>

              {/* Applied Offers */}
              {promotions.appliedOffers.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Ưu đãi đã áp dụng
                  </h3>
                  <div className="space-y-2">
                    {promotions.appliedOffers.map((offer, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3"
                      >
                        <div className="flex items-center">
                          <svg
                            className="h-5 w-5 text-green-400 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm font-medium text-green-800">
                            {offer}
                          </span>
                        </div>
                        <button
                          onClick={() => handlePromoCodeRemove(index)}
                          className="text-green-600 hover:text-green-800 text-sm underline"
                        >
                          Gỡ bỏ
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Discount Summary */}
                  {promotions.discountAmount > 0 && (
                    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-blue-900">
                          Giảm giá:
                        </span>
                        <span className="text-sm font-bold text-blue-900">
                          -{promotions.discountAmount.toLocaleString("vi-VN")}{" "}
                          VND
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-blue-200">
                        <span className="text-sm font-medium text-blue-900">
                          Tổng tiền sau giảm:
                        </span>
                        <span className="text-lg font-bold text-blue-900">
                          {(
                            (product?.price || 0) * quantity -
                            promotions.discountAmount
                          ).toLocaleString("vi-VN")}{" "}
                          VND
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Available Promotions Info */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Mã giảm giá có sẵn
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <ul className="list-disc list-inside space-y-1">
                        <li className="break-words">
                          <strong>PREORDER10</strong> - Giảm 10% cho đơn
                          preorder
                        </li>
                        <li className="break-words">
                          <strong>WELCOME5</strong> - Giảm 5% cho khách hàng mới
                        </li>
                        <li className="break-words">
                          <strong>PNJ20</strong> - Giảm 20% cho sản phẩm PNJ
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Policy Section */}
            <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gray-50 rounded-lg">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                📦 Chính sách pre-order
              </h2>

              {/* Accordion for Policy Details */}
              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setIsPolicyExpanded(!isPolicyExpanded)}
                  className="w-full px-3 sm:px-4 py-3 text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-t-lg flex items-center justify-between touch-manipulation"
                >
                  <span className="text-sm font-medium text-gray-900">
                    Điều khoản và điều kiện đặt hàng trước
                  </span>
                  <svg
                    className={`h-5 w-5 text-gray-500 transform transition-transform flex-shrink-0 ${
                      isPolicyExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isPolicyExpanded && (
                  <div className="px-4 py-3 bg-white border-t border-gray-200 rounded-b-lg">
                    <div className="space-y-4 text-sm text-gray-700">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          ⏰ Thời gian giao hàng
                        </h4>
                        <p>
                          Sản phẩm pre-order có thời gian giao hàng dự kiến từ
                          30-45 ngày kể từ ngày xác nhận đơn hàng và thanh toán
                          thành công.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          💰 Chính sách thanh toán
                        </h4>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>
                            Đơn hàng pre-order yêu cầu thanh toán 100% trước khi
                            bắt đầu sản xuất
                          </li>
                          <li>
                            Không hỗ trợ thanh toán trả góp cho đơn hàng
                            pre-order
                          </li>
                          <li>Thanh toán qua chuyển khoản hoặc ví điện tử</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          � Chính sách đổi trả
                        </h4>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>
                            Sản phẩm pre-order không hỗ trợ đổi trả sau khi bắt
                            đầu sản xuất
                          </li>
                          <li>
                            Chỉ chấp nhận hủy đơn hàng trong vòng 24 giờ kể từ
                            thời điểm đặt hàng
                          </li>
                          <li>
                            Hoàn tiền 100% nếu hủy trong thời gian quy định
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          🎨 Tùy chỉnh sản phẩm
                        </h4>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>
                            Sản phẩm được sản xuất theo đúng thiết kế đã chọn
                          </li>
                          <li>
                            Không thể thay đổi thiết kế sau khi xác nhận và
                            thanh toán
                          </li>
                          <li>
                            PNJ cam kết chất lượng vàng và đá theo tiêu chuẩn
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          📞 Liên hệ hỗ trợ
                        </h4>
                        <p>Nếu có thắc mắc về đơn hàng, vui lòng liên hệ:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Hotline: 1800 5454 46</li>
                          <li>Email: preorder@pnj.com.vn</li>
                          <li>Website: www.pnj.com.vn</li>
                        </ul>
                      </div>

                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-yellow-800 text-xs">
                          <strong>Lưu ý:</strong> Bằng việc đặt hàng pre-order,
                          bạn đã đọc, hiểu và đồng ý với các điều khoản trên.
                          PNJ có quyền thay đổi chính sách mà không cần thông
                          báo trước.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Policy Summary */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white p-3 rounded border text-center">
                  <div className="text-2xl mb-1">⏰</div>
                  <div className="font-medium text-gray-900">30-45 ngày</div>
                  <div className="text-gray-600">Thời gian giao hàng</div>
                </div>
                <div className="bg-white p-3 rounded border text-center">
                  <div className="text-2xl mb-1">💰</div>
                  <div className="font-medium text-gray-900">
                    100% thanh toán
                  </div>
                  <div className="text-gray-600">Trước sản xuất</div>
                </div>
                <div className="bg-white p-3 rounded border text-center">
                  <div className="text-2xl mb-1">🔄</div>
                  <div className="font-medium text-gray-900">Không đổi trả</div>
                  <div className="text-gray-600">Sau sản xuất</div>
                </div>
              </div>
            </div>

            {/* Order Notes Section */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                📝 Ghi chú & nút đặt hàng
              </h2>

              {/* Order Notes */}
              <div className="mb-6">
                <label
                  htmlFor="orderNotes"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Ghi chú đơn hàng (tùy chọn)
                </label>
                <textarea
                  id="orderNotes"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Ví dụ: Giao hàng vào buổi sáng, màu vàng hồng thay vì vàng vàng, etc."
                />
                <p className="mt-1 text-xs text-gray-500">
                  Mọi yêu cầu đặc biệt về sản phẩm hoặc giao hàng vui lòng ghi
                  chú tại đây.
                </p>
              </div>

              {/* Order Summary */}
              <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Tóm tắt đơn hàng
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sản phẩm:</span>
                    <span className="font-medium">{product?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số lượng:</span>
                    <span className="font-medium">{quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Giá gốc:</span>
                    <span className="font-medium">
                      {((product?.price || 0) * quantity).toLocaleString(
                        "vi-VN"
                      )}{" "}
                      VND
                    </span>
                  </div>
                  {promotions.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá:</span>
                      <span className="font-medium">
                        -{promotions.discountAmount.toLocaleString("vi-VN")} VND
                      </span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Tổng cộng:</span>
                      <span>
                        {(
                          (product?.price || 0) * quantity -
                          promotions.discountAmount
                        ).toLocaleString("vi-VN")}{" "}
                        VND
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col items-center space-y-4">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`w-full max-w-md px-6 py-3 sm:py-4 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors text-base touch-manipulation ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang xử lý...
                    </div>
                  ) : (
                    "Đặt hàng trước"
                  )}
                </button>

                <p className="text-xs sm:text-sm text-gray-500 text-center max-w-md px-4">
                  Bằng việc nhấn &quot;Đặt hàng trước&quot;, bạn đồng ý với các
                  điều khoản và chính sách của PNJ.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
