/*
 * Copyright (c) 2012, Christoph Gockel.
 * All rights reserved.
 *
 * Licensed under the MIT License. See MIT-LICENSE.txt for further details.
 */
test('Constructor with String parameter - dot', function() {
  var money = new Money("238.79");
  strictEqual(money.toDouble(), 238.79);
  strictEqual(money.toString(), "238.79");
});

test('Constructor with String parameter - comma', function() {
  var money = new Money("238,79");
  strictEqual(money.toDouble(), 238.79);
  strictEqual(money.toString(), "238.79");
});

test('Constructor with Double parameter', function() {
  var money = new Money(124.54);
  strictEqual(money.toDouble(), 124.54);
  strictEqual(money.toString(), "124.54");
});

test('Copy constructor', function() {
  var money = new Money(124.54);
  var copiedMoney = new Money(money);
  
  strictEqual(copiedMoney.toDouble(), money.toDouble());
});

test('Invalid constructor parameter should throw Exception', function() {
  raises(function() {
    new Money("no-valid-number")
  });
});

test('String value always contains dot', function() {
  var money = new Money("1,23");
  
  strictEqual(money.toString(), "1.23");
});

test('Addition', function() {
  var money = new Money("15.5");
  
  strictEqual(money.toDouble(), 15.5);
  
  money.add(5);
  strictEqual(money.toDouble(), 20.50);
  
  money.add(14.39);
  strictEqual(money.toDouble(), 34.89);
});

test('Subtraction', function() {
  var money = new Money("15.5");
  
  strictEqual(money.toDouble(), 15.50);
  
  money.subtract(5);
  strictEqual(money.toDouble(), 10.50);
  
  money.subtract(9.89);
  strictEqual(money.toDouble(), 0.61);
});

test('Multiplication', function() {
  var money = new Money("20.5");
  
  money.multiply(1.19);
  strictEqual(money.toDouble(), 24.39);
});

test('Division', function() {
  var money = new Money("24.39");
  
  money.divide(1.19);
  strictEqual(money.toDouble(), 20.50);
  
  money = new Money("10.00");
  money.divide(2);
  strictEqual(money.toDouble(), 5.00);
  
  money = new Money("15.00");
  money.divide(2);
  strictEqual(money.toDouble(), 7.50);
  
  money = new Money("18.50");
  money.divide(2);
  strictEqual(money.toDouble(), 9.25);
});

test('Simple arithmetic', function() {
  var money = new Money("105.80");
  money.multiply(1.19);
  strictEqual(money.toDouble(), 125.90);

  money.subtract(5.90);
  strictEqual(money.toDouble(), 120.00);
});

test('Small divisions', function() {
  var money = new Money("0.06");
  
  money.divide(2);
  strictEqual(money.toDouble(), 0.03);
});

test('Allocate even into two parts', function() {
  var money = new Money("0.05");
  var monies = money.allocate(new Array(0.5, 0.5));
  
  strictEqual(monies[0].toDouble(), new Money(0.03).toDouble());
  strictEqual(monies[1].toDouble(), new Money(0.02).toDouble());
});

test('Allocate uneven into two parts', function() {
  var allocation = new Array(.3, .7);
  var result = new Money("0.05").allocate(allocation);

  strictEqual(result[0].toDouble(), new Money(0.02).toDouble());
  strictEqual(result[1].toDouble(), new Money(0.03).toDouble());
});

test('Arithmetic', function() {
  var money = new Money("5.0");
  
  money.add(5);
  money.add(2.5);
  money.subtract(0.5);
  money.divide(3);
  money.multiply(4);
  
  strictEqual(money.toDouble(), 16.0);
});

test('Associative Law', function() {
  var firstMoney = new Money("1.17");
  firstMoney.multiply(57);
  firstMoney.multiply(1.19);
  strictEqual(firstMoney.toDouble(), 79.36);
  
  var secondMoney = new Money("1.17");
  secondMoney.multiply(1.19);
  secondMoney.multiply(57);
  strictEqual(secondMoney.toDouble(), 79.36);
  
  strictEqual(secondMoney.toDouble(), firstMoney.toDouble());
});

test('MoneyValue doesn\'t change state', function() {
  var fifteen = new MoneyValue(15);
  strictEqual(fifteen.plus(5).times(5).minus(10).divideBy(9).toDouble(), 10);
  strictEqual(fifteen.toDouble(), 15);
});

test('MoneyValue Addition', function() {
  var money = new MoneyValue(5);
  
  strictEqual(money.plus(5).toDouble(), 10);
  strictEqual(money.toDouble(), 5);
});

test('MoneyValue Subtraction', function() {
  var money = new MoneyValue(15);
  
  strictEqual(money.minus(5).toDouble(), 10);
  strictEqual(money.toDouble(), 15);
});

test('MoneyValue Multiplication', function() {
  var money = new MoneyValue(10);
  
  strictEqual(money.times(10).toDouble(), 100);
  strictEqual(money.toDouble(), 10);
});
  	
test('MoneyValue Division', function() {
  var money = new MoneyValue(50);
  
  strictEqual(money.divideBy(2).toDouble(), 25);
  strictEqual(money.toDouble(), 50);
});

test('MoneyValue Associative Law', function() {
  var base1 = new MoneyValue(1.17);
  strictEqual(base1.times(1.19).times(57).toDouble(), 79.36);
  
  var base2 = new MoneyValue(1.17);
  strictEqual(base2.times(57).times(1.19).toDouble(), 79.36);
  		
  strictEqual(base2.toDouble(), base1.toDouble());
});