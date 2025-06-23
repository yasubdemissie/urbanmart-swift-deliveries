
import { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = async () => {
    if (!orderNumber.trim()) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock tracking data
    setTrackingResult({
      orderNumber: orderNumber,
      status: 'in_transit',
      estimatedDelivery: '2024-01-25',
      currentLocation: 'Distribution Center - Downtown',
      trackingSteps: [
        {
          status: 'ordered',
          title: 'Order Placed',
          description: 'Your order has been received and is being processed',
          date: '2024-01-20 10:30 AM',
          completed: true
        },
        {
          status: 'processing',
          title: 'Order Processing',
          description: 'Items are being picked and packed',
          date: '2024-01-21 2:15 PM',
          completed: true
        },
        {
          status: 'shipped',
          title: 'Shipped',
          description: 'Package has left our facility',
          date: '2024-01-22 9:45 AM',
          completed: true
        },
        {
          status: 'in_transit',
          title: 'In Transit',
          description: 'Package is on its way to you',
          date: '2024-01-23 6:20 AM',
          completed: true,
          current: true
        },
        {
          status: 'delivered',
          title: 'Delivered',
          description: 'Package delivered to your address',
          date: 'Expected: 2024-01-25',
          completed: false
        }
      ]
    });
    setIsLoading(false);
  };

  const getStatusIcon = (status, completed, current) => {
    if (current) return <Truck className="h-5 w-5 text-blue-600" />;
    if (completed) return <CheckCircle className="h-5 w-5 text-green-600" />;
    return <Clock className="h-5 w-5 text-gray-400" />;
  };

  const getStatusColor = (completed, current) => {
    if (current) return 'border-blue-600 bg-blue-50';
    if (completed) return 'border-green-600 bg-green-50';
    return 'border-gray-300 bg-gray-50';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600">Enter your order number to see real-time tracking information</p>
        </div>

        {/* Track Input */}
        <div className="max-w-md mx-auto mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Order Number
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      id="orderNumber"
                      placeholder="Enter your order number (e.g., UM123456)"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      className="pl-10"
                      onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleTrack} 
                  disabled={!orderNumber.trim() || isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Tracking...' : 'Track Order'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tracking Results */}
        {trackingResult && (
          <div className="max-w-2xl mx-auto">
            {/* Order Summary */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{trackingResult.orderNumber}
                    </h3>
                    <p className="text-gray-600">Current Status: 
                      <span className="ml-1 font-medium text-blue-600 capitalize">
                        {trackingResult.status.replace('_', ' ')}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Estimated Delivery</p>
                    <p className="font-semibold text-gray-900">{trackingResult.estimatedDelivery}</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Package className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-blue-800 font-medium">
                      Current Location: {trackingResult.currentLocation}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Timeline */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Tracking Timeline</h3>
                
                <div className="space-y-4">
                  {trackingResult.trackingSteps.map((step, index) => (
                    <div key={index} className="flex items-start">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center ${getStatusColor(step.completed, step.current)}`}>
                        {getStatusIcon(step.status, step.completed, step.current)}
                      </div>
                      
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium ${step.current ? 'text-blue-600' : step.completed ? 'text-green-600' : 'text-gray-400'}`}>
                            {step.title}
                          </h4>
                          <span className="text-sm text-gray-500">{step.date}</span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm mb-4">
                Need help? Contact our customer service team
              </p>
              <div className="space-x-4">
                <Button variant="outline" size="sm">
                  📞 Call Support
                </Button>
                <Button variant="outline" size="sm">
                  💬 Live Chat
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Sample Order Numbers */}
        {!trackingResult && (
          <div className="max-w-md mx-auto">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-medium text-blue-900 mb-2">Try these sample order numbers:</h4>
                <div className="space-y-1 text-sm text-blue-700">
                  <div 
                    className="cursor-pointer hover:underline"
                    onClick={() => setOrderNumber('UM123456')}
                  >
                    UM123456 - In Transit
                  </div>
                  <div 
                    className="cursor-pointer hover:underline"
                    onClick={() => setOrderNumber('UM789012')}
                  >
                    UM789012 - Delivered
                  </div>
                  <div 
                    className="cursor-pointer hover:underline"
                    onClick={() => setOrderNumber('UM345678')}
                  >
                    UM345678 - Processing
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default TrackOrder;
