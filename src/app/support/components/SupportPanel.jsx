import { motion } from "framer-motion";
import StatsCard from "./StatsCard";
import ChartContainer from "./ChartContainer";
import CategoryConversations from "./CategoryConversations";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

export default function SupportPanel({ view, categories, selectedCategory, setActiveChatId, handleGoToCategory, quickStats, exerciseData, appPerfData }) {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {view === "category" ? (
          <CategoryConversations
            selectedCategory={selectedCategory}
            categories={categories}
            onSelectChat={(id) => setActiveChatId(id)}
          />
        ) : (
          <>
            {/* Üstte istatistik kartları */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickStats.map((stat, index) => (
                <StatsCard
                  key={index}
                  title={stat.title}
                  value={stat.value}
                  changeText={stat.change}
                  icon={stat.icon}
                  trend={stat.trend}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div>
                <ChartContainer title="AI Performansı">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={exerciseData} margin={{ top:5, right: 20, left: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12, fill: "#6b7280" }} 
                        interval={0}
                      />
                      <YAxis hide />
                      <Line type="monotone" dataKey="normal" stroke="#d1d5db" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="current" stroke="#000000" strokeWidth={3} dot={{ fill: "#000000", strokeWidth: 0, r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              <div>
                <ChartContainer title="Uygulama Performansı">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={appPerfData} margin={{ top:5, right: 20, left: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12, fill: "#6b7280" }} 
                        interval={0}
                      />
                      <YAxis hide />
                      <Line type="monotone" dataKey="normal" stroke="#d1d5db" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="current" stroke="#000000" strokeWidth={3} dot={{ fill: "#000000", strokeWidth: 0, r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>

            {/* Kategori Butonları */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleGoToCategory(cat.id)}
                    className="group bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:border-gray-300 hover:shadow-md transition-all duration-200 text-left min-h-[120px]"
                    title={cat.title}
                  >
                    <div className="flex flex-col items-center justify-center gap-3 h-full">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                        <Icon className="w-6 h-6 text-gray-700" />
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-medium text-gray-900 leading-tight">{cat.title}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </motion.div>
    </main>
  );
}   