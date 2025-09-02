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
                    <LineChart data={exerciseData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
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
                    <LineChart data={appPerfData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                      <YAxis hide />
                      <Line type="monotone" dataKey="normal" stroke="#d1d5db" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="current" stroke="#000000" strokeWidth={3} dot={{ fill: "#000000", strokeWidth: 0, r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>

            {/* Kategori Butonları */}
            <div className="flex items-center justify-start gap-2 flex-wrap">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleGoToCategory(cat.id)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    title={cat.title}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{cat.title}</span>
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