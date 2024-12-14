"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
class ShopImpl {
    constructor() {
        this.products = new Map();
    }
    addNewProduct(product) {
        if (this.products.has(product.id)) {
            return false;
        }
        this.products.set(product.id, product);
        return true;
    }
    deleteProduct(id) {
        return this.products.delete(id);
    }
    listProductsByName(searchString) {
        const result = [];
        const nameMap = new Map();
        for (const product of this.products.values()) {
            if (product.name.includes(searchString)) {
                const products = nameMap.get(product.name) || [];
                products.push(product);
                nameMap.set(product.name, products);
            }
        }
        for (const [name, products] of nameMap) {
            if (products.length === 1) {
                result.push(name);
            }
            else {
                products.forEach((p) => {
                    result.push(`${p.producer} - ${p.name}`);
                });
            }
        }
        return result.slice(0, 10);
    }
    listProductsByProducer(searchString) {
        const result = [];
        const producerMap = new Map();
        for (const product of this.products.values()) {
            if (product.producer.includes(searchString)) {
                const products = producerMap.get(product.producer) || [];
                products.push(product);
                producerMap.set(product.producer, products);
            }
        }
        Array.from(producerMap.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .forEach(([_, products]) => {
            products.forEach((p) => {
                result.push(p.name);
            });
        });
        return result.slice(0, 10);
    }
}
// Interactive testing interface
const readline = __importStar(require("readline"));
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const shop = new ShopImpl();
function displayMenu() {
    console.log("\n=== Shop Testing Menu ===");
    console.log("1. Add new product");
    console.log("2. Delete product");
    console.log("3. Search products by name");
    console.log("4. Search products by producer");
    console.log("5. Add sample data");
    console.log("6. Exit");
    console.log("=====================");
}
function addSampleData() {
    const sampleProducts = [
        { id: "1", name: "iPhone 13", producer: "Apple" },
        { id: "2", name: "Galaxy S21", producer: "Samsung" },
        { id: "3", name: "iPhone 14", producer: "Apple" },
        { id: "4", name: "Pixel 6", producer: "Google" },
        { id: "5", name: "MacBook Pro", producer: "Apple" },
        { id: "6", name: "Galaxy Tab", producer: "Samsung" },
        { id: "7", name: "iPad Pro", producer: "Apple" },
        { id: "8", name: "Surface Laptop", producer: "Microsoft" },
        { id: "9", name: "Galaxy Book", producer: "Samsung" },
        { id: "10", name: "Pixel Tablet", producer: "Google" },
    ];
    sampleProducts.forEach((product) => {
        const result = shop.addNewProduct(product);
        console.log(`Added ${product.name}: ${result}`);
    });
}
async function handleUserInput() {
    while (true) {
        displayMenu();
        const choice = await new Promise((resolve) => {
            rl.question("Enter your choice (1-6): ", resolve);
        });
        switch (choice) {
            case "1":
                const id = await new Promise((resolve) => {
                    rl.question("Enter product ID: ", resolve);
                });
                const name = await new Promise((resolve) => {
                    rl.question("Enter product name: ", resolve);
                });
                const producer = await new Promise((resolve) => {
                    rl.question("Enter producer name: ", resolve);
                });
                const result = shop.addNewProduct({ id, name, producer });
                console.log(`Product ${result ? "added successfully" : "already exists"}`);
                break;
            case "2":
                const deleteId = await new Promise((resolve) => {
                    rl.question("Enter product ID to delete: ", resolve);
                });
                const deleteResult = shop.deleteProduct(deleteId);
                console.log(`Product ${deleteResult ? "deleted successfully" : "not found"}`);
                break;
            case "3":
                const nameSearch = await new Promise((resolve) => {
                    rl.question("Enter name search string: ", resolve);
                });
                const nameResults = shop.listProductsByName(nameSearch);
                console.log("\nSearch results:");
                nameResults.forEach((result, index) => {
                    console.log(`${index + 1}. ${result}`);
                });
                break;
            case "4":
                const producerSearch = await new Promise((resolve) => {
                    rl.question("Enter producer search string: ", resolve);
                });
                const producerResults = shop.listProductsByProducer(producerSearch);
                console.log("\nSearch results:");
                producerResults.forEach((result, index) => {
                    console.log(`${index + 1}. ${result}`);
                });
                break;
            case "5":
                addSampleData();
                break;
            case "6":
                rl.close();
                return;
            default:
                console.log("Invalid choice. Please try again.");
        }
    }
}
// Start the interactive testing
console.log("Welcome to the Shop Testing Interface");
handleUserInput().then(() => {
    console.log("Thank you for testing the Shop implementation!");
    process.exit(0);
});
