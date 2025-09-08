

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  BookOpen, 
  Settings, 
  UserPlus, 
  Menu, 
  X, 
  GraduationCap,
  Home as HomeIcon,
  Users,
  Calendar,
  FileText,
  Bell,
  LogOut,
  ChevronRight,
  Search,
  User,
  ChevronDown
} from 'lucide-react';

import CreateUserModal from './Users/CreateUser';
import UsersManagement from "./Users/UsersManagment";
import ResourceUpload from "./ResourcesDash/AddResource";
import ImprovedResourcesTable from "./ResourcesDash/Getallresources";
import ClaimResourceForm from "./ResourcesDash/TeacherResources";
import ResourceList from "./ResourcesDash/Teacher&Resource";
import Resources from './ResourcesDash/Resources';
import Overview from './Dashboard/Overview';
import SideBar from './Dashboard/SideBar';
import Header from './Dashboard/Header';
import IsAdmin from '../components/IsAdmin';
import MyResources from './ResourcesDash/MyResources';
import UploadCSV from "./ResourcesDash/UploadCSV"
export default function Home() {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'overview';
  });

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'UsersManagement':
          return <UsersManagement />;
       case 'CreateUserModal':
            return <CreateUserModal />;
      case 'resources':
        return <ImprovedResourcesTable />;
        case 'MyResources':
        return <MyResources />;
      case 'addResource':
        return <ResourceUpload />;
      case 'getAllResources':
        return <GetAllResources />;
      case 'claimResource':
        return <ClaimResourceForm />;
      case 'ResourceList':
        return <ResourceList />;
      case 'UploadCSV':
        return <UploadCSV />;
     
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">

      <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="min-h-screen flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="animate-in fade-in duration-300">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
   


  );
}
