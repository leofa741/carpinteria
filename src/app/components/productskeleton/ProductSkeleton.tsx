interface ProductSkeletonProps {
    view: 'grid' | 'list';
}

const ProductSkeleton = ({ view }: ProductSkeletonProps) => {
    return view === 'grid' ? (
        <div className="animate-pulse flex flex-col gap-2 border rounded-lg p-2">
            <div className="bg-gray-300 h-40 w-full rounded-md" />
            <div className="h-4 bg-gray-300 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
    ) : (
        <div className="animate-pulse flex gap-4 border rounded-lg p-4">
            <div className="bg-gray-300 h-24 w-24 rounded-md" />
            <div className="flex flex-col justify-between flex-1">
                <div className="h-4 bg-gray-300 rounded w-2/3 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-1/4" />
            </div>
        </div>
    );
};

export default ProductSkeleton;
