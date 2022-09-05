import { validateEmailAddress } from "../src/validators/validators";

describe('Email validation', () => {
  test('Test email', () => {
    expect(validateEmailAddress('')).toBeFalsy();
    expect(validateEmailAddress('hello.yahoo.com')).toBeFalsy();
    expect(validateEmailAddress('hello@yahoo.com')).toBeTruthy();
    expect(validateEmailAddress('someone@[216.109.118.76]')).toBeTruthy();
    expect(validateEmailAddress('postmaster@[IPv6:2001:0db8:85a3:0000:0000:8a2e:0370:7334]')).toBeTruthy;
    expect(validateEmailAddress('"very.(),:;<>[]\".VERY.\"very@\\ \"very\".unusual"@strange.example.com')).toBeTruthy();
  });
  
  test('Test email extension', () => {
    expect(validateEmailAddress('jsmith@google.org')).toBeTruthy();
    expect(validateEmailAddress('name@yahoo.cinema')).toBeTruthy();
    expect(validateEmailAddress('jsmith@google.c')).toBeFalsy();
    expect(validateEmailAddress('jsmith@google.')).toBeFalsy();
    expect(validateEmailAddress('jsmith@google')).toBeFalsy();
    expect(validateEmailAddress('name@yahoo.cine-ma')).toBeFalsy();
  });

  test('Test email with dash', () => {
    expect(validateEmailAddress('john@hello-world.-org')).toBeFalsy();
    expect(validateEmailAddress('john@hello-world.o-rg')).toBeFalsy();
    expect(validateEmailAddress('john-doe@hello-world.org')).toBeTruthy();
    expect(validateEmailAddress('john.doe@hello-world.org')).toBeTruthy();
    expect(validateEmailAddress("john.doe'@hello-world.org")).toBeTruthy();
  });

  test('Test email with comma', () => {
    expect(validateEmailAddress('john@hello,world.org')).toBeFalsy();
    expect(validateEmailAddress('john@helloworld.o,rg')).toBeFalsy();
    expect(validateEmailAddress('johndoe@helloworld,org')).toBeFalsy();
    expect(validateEmailAddress('john,doe@helloworld.org')).toBeFalsy();
  });

  test('Test email with whitespaces', () => {
    expect(validateEmailAddress('john @helloworld.org')).toBeFalsy();
    expect(validateEmailAddress('john@ helloworld.org')).toBeFalsy();
    expect(validateEmailAddress(' john@helloworld.org')).toBeFalsy();
    expect(validateEmailAddress('john@helloworld.org ')).toBeFalsy();
    expect(validateEmailAddress("\"john \"@google.com")).toBeTruthy();
    expect(validateEmailAddress('" "@example.org')).toBeTruthy();
  });

  test('Test domain name in emails address', () => {
    expect(validateEmailAddress('john@^&#.com')).toBeFalsy();
    expect(validateEmailAddress('jessica@at&t.net')).toBeFalsy();
    expect(validateEmailAddress('jessica@att.com')).toBeTruthy();
  });
});