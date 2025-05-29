import ContentLoader from "react-content-loader";

export default function SkeletonCard() {
  return (
    <div className="w-full">
      <ContentLoader
        speed={2}
        width="100%"
        height={260}
        viewBox="0 0 300 260"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        className="w-full"
      >
        {/* Imagen cuadrada */}
        <rect x="0" y="0" rx="16" ry="16" width="100%" height="180" />
        {/* Dirección */}
        <rect x="0" y="190" rx="4" ry="4" width="75%" height="15" />
        {/* Título */}
        <rect x="0" y="210" rx="4" ry="4" width="60%" height="12" />
        {/* Precio */}
        <rect x="0" y="230" rx="4" ry="4" width="40%" height="15" />
      </ContentLoader>
    </div>
  );
}