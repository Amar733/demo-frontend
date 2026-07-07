'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LocationPicker from '@/components/LocationPicker';
import { Plus, MapPin, Check, Trash2, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '@/components/config/api';

interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  fullAddress: string;
}

interface SavedAddress extends Address {
  _id: string;
  label?: string;
  isDefault?: boolean;
}

export default function CheckoutPage() {
  const { user, authFetch } = useAuth();
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [fullName, setFullName] = useState(user?.name || '');
  
  // Saved addresses management
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [savingAddress, setSavingAddress] = useState(false);
  
  // New/Edit address form
  const [addressLabel, setAddressLabel] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const response = await authFetch('/users/addresses');
      const data = await response.json();
      
      if (data.success) {
        setSavedAddresses(data.data);
        // Auto-select default address
        const defaultAddr = data.data.find((addr: SavedAddress) => addr.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr._id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  // Fetch user addresses on component mount
  useEffect(() => {
    fetchAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
    setMobile(value);
  };

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
    setPostalCode(value);
  };

  const handleAddressSelect = (locationAddress: Address) => {
    // Auto-fill the address fields with location data
    setAddress(locationAddress.street || locationAddress.fullAddress);
    setCity(locationAddress.city);
    setState(locationAddress.state);
    setPostalCode(locationAddress.postalCode);
    setCountry(locationAddress.country);
  };

  const handleSaveAddress = async () => {
    if (!address || !city || !state || !postalCode || !country) {
      alert('Please fill in all address fields');
      return;
    }

    try {
      setSavingAddress(true);
      
      const response = await authFetch('/users/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          label: addressLabel || `Address ${savedAddresses.length + 1}`,
          street: address,
          city,
          state,
          postalCode,
          country,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh addresses from server
        await fetchAddresses();
        
        // Clear form
        setAddressLabel('');
        setAddress('');
        setCity('');
        setState('');
        setPostalCode('');
        setCountry('');
        setShowAddressForm(false);

        // Select the newly added address
        setSelectedAddressId(data.data._id);
      } else {
        alert(data.error || 'Failed to save address');
      }
    } catch (error) {
      console.error('Failed to save address:', error);
      alert('Failed to save address. Please try again.');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      const response = await authFetch(`/users/addresses/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        // Refresh addresses
        await fetchAddresses();
        
        if (selectedAddressId === id) {
          setSelectedAddressId(null);
        }
      } else {
        alert(data.error || 'Failed to delete address');
      }
    } catch (error) {
      console.error('Failed to delete address:', error);
      alert('Failed to delete address. Please try again.');
    }
  };

  const handleSelectAddress = (id: string) => {
    setSelectedAddressId(id);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedAddressId) {
      alert('Please select a delivery address');
      return;
    }

    const selectedAddress = savedAddresses.find(addr => addr._id === selectedAddressId);
    
    // Handle checkout logic
    console.log('Processing checkout...', {
      mobile,
      fullName,
      deliveryAddress: selectedAddress,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2"
                  required
                />
                {user?.name && (
                  <p className="text-xs text-green-600 mt-1">✓ Auto-filled from profile</p>
                )}
              </div>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={mobile}
                  onChange={handleMobileChange}
                  pattern="\d*"
                  inputMode="numeric"
                  className="w-full border rounded-lg px-4 py-2"
                  required
                  minLength={10}
                  maxLength={15}
                />
               
                {user?.mobile ? (
                  <p className="text-xs text-green-600 mt-1">✓ Auto-filled from profile</p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">Enter numbers only (10-15 digits)</p>
                )}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Shipping Address</h2>
              <button
                type="button"
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add New Address
              </button>
            </div>

            {/* Saved Addresses List */}
            {loadingAddresses ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading addresses...</span>
              </div>
            ) : savedAddresses.length > 0 && (
              <div className="space-y-3 mb-6">
                <p className="text-sm text-gray-600 mb-2">Select delivery address:</p>
                {savedAddresses.map((addr) => (
                  <div
                    key={addr._id}
                    className={`relative border rounded-lg p-4 cursor-pointer transition ${
                      selectedAddressId === addr._id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => handleSelectAddress(addr._id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="font-semibold text-sm">{addr.label}</span>
                          {addr.isDefault && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                              Default
                            </span>
                          )}
                          {selectedAddressId === addr._id && (
                            <Check className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-700 ml-6">{addr.fullAddress}</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAddress(addr._id);
                        }}
                        className="text-red-500 hover:text-red-700 ml-2"
                        aria-label="Delete address"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Address Form */}
            {showAddressForm && (
              <div className="border rounded-lg p-4 mb-4 bg-gray-50">
                <h3 className="font-semibold mb-3">Add New Address</h3>
                
                {/* Location Picker */}
                <LocationPicker onAddressSelect={handleAddressSelect} />
                
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Address Label (e.g., Home, Office)"
                    value={addressLabel}
                    onChange={(e) => setAddressLabel(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2"
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="border rounded-lg px-4 py-2"
                      required
                    />
                    <input
                      type="text"
                      placeholder="State/Province"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="border rounded-lg px-4 py-2"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Postal Code"
                        value={postalCode}
                        onChange={handlePostalCodeChange}
                        pattern="\d*"
                        inputMode="numeric"
                        className="border rounded-lg px-4 py-2 w-full"
                        required
                        minLength={4}
                        maxLength={10}
                      />
                      <p className="text-xs text-gray-500 mt-1">Numbers only</p>
                    </div>
                    <input
                      type="text"
                      placeholder="Country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="border rounded-lg px-4 py-2"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSaveAddress}
                      disabled={savingAddress}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {savingAddress ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        'Save Address'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      disabled={savingAddress}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Show message if no addresses */}
            {!loadingAddresses && savedAddresses.length === 0 && !showAddressForm && (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-2">No saved addresses</p>
                <button
                  type="button"
                  onClick={() => setShowAddressForm(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Add your first address
                </button>
              </div>
            )}
          </div>

          {/* Payment */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Payment</h2>
            <p className="text-gray-600 mb-4">Payment integration coming soon...</p>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Place Order
          </button>
        </form>

        {/* Order Summary */}
        <div className="border rounded-lg p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <p className="text-gray-600">Your cart items will appear here</p>
        </div>
      </div>
    </div>
  );
}
