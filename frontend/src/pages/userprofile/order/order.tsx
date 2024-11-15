import React from "react";
import { Card, CardHeader, CardFooter, CardContent } from "@/components/ui/card";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { faShippingFast, faCalendar, faCartShopping, faCalendarCheck, faCalendarTimes, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { IconShipping, IconCalendar, IconReceipt };

// Mock data (replace with actual data from your API or state)
const orderData = {
    orderId: "123456789",
    orderDate: "2024-11-12",
    status: "Shipped",
    estimatedDelivery: "2024-11-20",
    items: [
      { id: 1, name: "Crochet Hook Set", quantity: 2, price: "$15.00" },
      { id: 2, name: "Yarn Bundle", quantity: 1, price: "$25.00" },
    ],
    totalAmount: "$55.00",
};

export function SettingsOrderDetails() {
  return (
    <div className="container mx-auto my-10 p-4 md:p-8">
    <h1 className="text-3xl font-bold mb-8">Order Details</h1>

    {/* Order Summary */}
    <Card className="mb-8">
      <CardHeader>
        <h2 className="text-lg font-semibold">Order Summary</h2>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center space-x-3">
            <FontAwesomeIcon icon={faCartShopping} />
          <div>
            <p className="text-sm">Order ID</p>
            <p className="font-medium">{orderData.orderId}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <FontAwesomeIcon icon={faCalendarCheck} />
          <div>
            <p className="text-sm">Order Date</p>
            <p className="font-medium">{orderData.orderDate}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <FontAwesomeIcon icon={faShippingFast} />
          <div>
            <p className="text-sm">Status</p>
            <Badge color={orderData.status === "Shipped" ? "green" : "yellow"}>{orderData.status}</Badge>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <FontAwesomeIcon icon={faCalendarAlt} />
          <div>
            <p className="text-sm">Estimated Delivery</p>
            <p className="font-medium">{orderData.estimatedDelivery}</p>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Items in Order */}
    <Card className="mb-8">
      <CardHeader>
        <h2 className="text-lg font-semibold">Items in Order</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        {orderData.items.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-3 gap-4 items-center border-b pb-4"
          >
            <div className="col-span-2">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm">Quantity: {item.quantity}</p>
            </div>
            <p className="text-right font-medium">{item.price}</p>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="text-lg font-semibold">Total Amount</p>
        <p className="text-xl font-bold">{orderData.totalAmount}</p>
      </CardFooter>
    </Card>

    {/* Actions */}
    <div className="flex justify-end space-x-4">
      <Button variant="outline" className="w-full md:w-auto">
        Contact Support
      </Button>
      <Button variant="default" color="primary" className="w-full md:w-auto">
        Track Shipment
      </Button>
    </div>
  </div>
  );
}
