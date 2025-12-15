import { useCategories } from "@/hooks/useProducts";
import { Category } from "@/lib/api";

// Extend the Category type to include icon and color for local use
type CategoryWithIcon = Category & {
  icon: string;
  color: string;
};

export default function Categories() {
  const { data: categories } = useCategories();
  const colorAndIcon = [
    { color: "from-pink-500 to-rose-500", icon: "👗" },
    { color: "from-green-500 to-emerald-500", icon: "🏡" },
    { color: "from-orange-500 to-amber-500", icon: "🏃" },
    { color: "from-purple-500 to-violet-500", icon: "📚" },
    { color: "from-red-500 to-pink-500", icon: "💄" },
  ];

  const categoriesData: CategoryWithIcon[] = categories?.map(
    (category: Category, i: number) => ({
      ...category,
      icon: colorAndIcon[i].icon,
      color: colorAndIcon[i].color,
    })
  );

  return (
    <section className="py-20 flex flex-col gap-6 items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 p-6">
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-sm text-muted-foreground">
            Discover our carefully curated collections across all your favorite
            categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 justify-center mx-auto">
          {categoriesData?.map((category: CategoryWithIcon) => (
            <div
              key={category.id}
              className="group relative overflow-hidden rounded-3xl p-8 text-center cursor-pointer transition-all duration-500 hover:scale-105 hover:-translate-y-2 w-full max-w-xs"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90 group-hover:opacity-100 transition-opacity`}
              ></div>
              <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3 className="font-bold text-white mb-2 text-lg">
                  {category.name}
                </h3>
                <p className="text-white/80 text-sm">
                  {category.productCount.toLocaleString()} items
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
