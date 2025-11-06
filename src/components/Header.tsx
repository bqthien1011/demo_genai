import Link from "next/link";

export default function Header() {
  return (
    <header className="text-black p-4 border-b border-gray-200 boxshadow-md mb-4">
      <nav className="container mx-auto flex justify-between items-center">
        <ul className="flex space-x-4 font-small">
          <li>
            <Link href="/" className="hover:underline flex space-x-4">
              <img
                width="19"
                height="19"
                src="https://cdn.pnj.io/images/2025/03/cauchuyenpnj-icon.svg"
              />
              Câu Chuyện PNJ
            </Link>
          </li>
          <li>
            <Link href="/products" className="hover:underline flex space-x-4">
              <img
                width="19"
                height="14.23"
                src="https://cdn.pnj.io/images/image-update/layout/icon-relationship-new.svg"
              />
              Quan Hệ Cổ Đông
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:underline flex space-x-4">
              <img
                width="19"
                height="18.97"
                src="https://cdn.pnj.io/images/image-update/layout/icon-stores-new.svg"
              />
              Cửa Hàng
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:underline flex space-x-4">
              <img
                width="19"
                height="18.97"
                src="https://cdn.pnj.io/images/2024/12/hiring-icon.svg"
              />
              Tuyển Dụng
            </Link>
          </li>
        </ul>
        <div className="text-xl font-bold">
          <img
            src="https://cdn.pnj.io/images/logo/pnj.com.vn.png"
            alt="PNJ Logo"
            className="h-8"
            height="38.7px"
            width="88px"
          />
        </div>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="hover:underline flex space-x-4">
              <img
                width="19"
                height="18.97"
                src="https://cdn.pnj.io/images/image-update/layout/icon-hotline-new.svg"
              />
              1800 54 54 57
            </Link>
          </li>
          <li>
            <Link href="/products" className="hover:underline flex space-x-4">
              <img
                alt="Tài khoản của tôi"
                width="20.47"
                height="19.95"
                src="https://cdn.pnj.io/images/2023/user-regular.svg"
              />
              Tài khoản của tôi
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:underline flex space-x-4">
              <img
                width="15.3167"
                height="18.9833"
                src="https://cdn.pnj.io/images/image-update/layout/icon-cart-new.svg"
              />
              Giỏ hàng
            </Link>
          </li>
        </ul>
      </nav>
      <nav className="container mx-auto flex justify-between items-center mt-4 border-t pt-4 border-gray-200">
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="hover:underline">
              Nam
            </Link>
          </li>
          <li>
            <Link href="/products" className="hover:underline">
              Nữ
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:underline">
              Trẻ Em
            </Link>
          </li>
        </ul>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Tìm kiếm
          </button>
        </div>
      </nav>
    </header>
  );
}
