export default function Campaigns() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex items-center gap-32">
        {/* Green Circle */}
        <div className="w-48 h-48 bg-green-600 rounded-full"></div>
        
        {/* Blue Square */}
        <div className="w-48 h-48 bg-blue-600"></div>
        
        {/* Black Diamond */}
        <div className="w-48 h-48 bg-black transform rotate-45"></div>
      </div>
    </div>
  );
}