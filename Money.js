/*
 * Copyright (c) 2012, Christoph Gockel.
 * All rights reserved.
 *
 * Licensed under the MIT License. See MIT-LICENSE.txt for further details.
 */
/**
 * Money.js is a very simple approach on calculating monetary values in JavaScript.
 * 
 */
function Money(value) {
  if (isNaN(value) && (typeof value == "string")) {
    value = value.replace(/\,/, '.');
    
    if (isNaN(value)) {
      throw amount + " is not a valid number";
    }
  }
  
  if (typeof value == 'string') {
    value = Math.round(parseFloat(value) * scalingFactor());
  } else if (typeof value == 'number') {
    value = value * scalingFactor();
  } else if (value instanceof Money || value instanceof MoneyValue) {
    value = value.toDouble(4) * scalingFactor();
  }
  
  var amount = value;
  
  this.add = function(value) {
    var scaledValue = (value * scalingFactor());
    var prec = Math.min(precision(amount), precision(scaledValue));
    
    amount = roundTo(parseInt(amount) + parseInt(scaledValue), prec);
  };

  this.subtract = function(value) {
    var scaledValue = (value * scalingFactor());
    var prec = Math.min(precision(amount), precision(scaledValue));
    
    amount = roundTo(amount - scaledValue, prec);
  };
    
  this.multiply = function(value) {
    var scaledValue = value;// * scalingFactor();
    var prec = Math.min(precision(amount), precision(scaledValue));
    var test = (amount * scaledValue);// / scalingFactor()) | 0;
    amount = roundTo(test, prec);
  };
  
  this.divide = function(value) {
    var prec = Math.min(precision(amount), precision(value));
    
    amount = roundTo(amount / value, prec);
  };

  this.toDouble = function(decimalPlaces) {
      decimalPlaces = decimalPlaces || 2;
    var normalizedValue = amount / scalingFactor();
    
    return 1 * normalizedValue.toFixed(decimalPlaces);
  };
  
  this.toString = function() {
    var normalizedValue = amount / scalingFactor();
    
    return "" + normalizedValue.toFixed(2);
  };
  
  this.allocate = function(ratios) {
    var remainder = this.toDouble();//amount;
    var results = new Array(ratios.length);
    var total = 0;
    
    for (var i = 0; i < ratios.length; i++) {
      total += ratios[i];
    }
    
    for (var i = 0; i < ratios.length; i++) {
      var share = Math.floor(amount * ratios[i] / total) | 0;
      share = normalize(share / scalingFactor());
      
      results[i] = new Money(share);
      
      remainder -= share;
    }
    
    for(var i = 0; remainder > 0; i++) {
      results[i].add(0.01);
      remainder--;
    }
    
    return results;
  };


  function precision(n) {
    return n.toString(10).replace(/^0+([^0])/,'$1').replace(/([^0]+)0+$/,'$1').replace(/^0+$/, '0').replace(/\./, '').length;
  }
  
  function roundTo(value, precision) {
    return Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
  }

  function scalingFactor() {
    return Math.pow(10, 4);
  }
  
  function normalize(value) {
    var stringValue = "" + value;
    if (stringValue.indexOf(".") > -1) {
      return parseFloat(stringValue.substring(0, stringValue.indexOf(".") + 3));
    }
    return value;
  }

//TODO this.compareTo = function(money) {}
}


function MoneyValue(value) {
  Money.call(this, value);
  
  this.plus = function(value) {
    var money = new MoneyValue(this);
    money.add(value);
    
    return money;
  };
  this.minus = function(value) {
    var money = new MoneyValue(this);
    money.subtract(value);
    
    return money;
  };
  this.times = function(value) {
    var money = new MoneyValue(this);
    money.multiply(value);
    
    return money;
  };
  this.divideBy = function(value) {
    var money = new MoneyValue(this);
    money.divide(value);
    
    return money;
  };
}